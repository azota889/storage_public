//********** imgsdk ****************/
var imgsdk=imgsdk || {};

imgsdk.version="0.1";

/**
 * Check the obj whether is function or not
 * @param {*} obj
 * @returns {boolean}
 */
 imgsdk.isFunction = function (obj) {
    return typeof obj === 'function';
};

/**
 * Check the obj whether is number or not
 * @param {*} obj
 * @returns {boolean}
 */
imgsdk.isNumber = function (obj) {
    return (typeof obj === 'number' || Object.prototype.toString.call(obj) === '[object Number]' || !isNaN(Number(obj)));
};

/**
 * Check the obj whether is string or not
 * @param {*} obj
 * @returns {boolean}
 */
 imgsdk.isString = function (obj) {
    return typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object String]';
};

/**
 * Check the obj whether is array or not
 * @param {*} obj
 * @returns {boolean}
 */
 imgsdk.isArray = function (obj) {
    return Array.isArray(obj) ||
        (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Array]');
};

/**
 * Check the obj whether is undefined or not
 * @param {*} obj
 * @returns {boolean}
 */
 imgsdk.isUndefined = function (obj) {
    return typeof obj === 'undefined';
};

/**
 * Check the obj whether is object or not
 * @param {*} obj
 * @returns {boolean}
 */
 imgsdk.isObject = function (obj) {
    return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * 
 * @param {} obj convert obj to array
 * @returns 
 */
imgsdk.objToArray=function(obj){
    var arr=[];
    for(var p in obj){
        arr.push(obj[p]);    
    }
    return arr;
}

/**
 * check browser supoort assembly
 * @returns 
 */
imgsdk.checkWebAssemblySupport=function(){
    try {
        if (typeof WebAssembly === "object"
            && typeof WebAssembly.instantiate === "function") {
            const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
            if (module instanceof WebAssembly.Module)
                return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
        }
    } catch (e) {
    }
    return false;   
}

/**
 * return sdk work in main client js or in worker
 */
imgsdk.isWorker=function(){
    if (typeof window !== 'undefined') return false
    return true;
}


/**
 * enable log printer
 */
imgsdk._isLog=true;
imgsdk.enableLog=function(isLog){
    imgsdk._isLog=isLog;
}
imgsdk.log=function(str){
    if(imgsdk._isLog){
        var timestamp=new Date().toISOString();
        var strlog=timestamp.substr(timestamp.length-13,13)+"--"+ str;
        console.log(strlog);
    }
};

/**
 * get image from url to Unit8Array
 * @param {*} url 
 * @returns 
 */
imgsdk.urlToUint8Array = async (url) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const arr = new Uint8Array(buffer);
    return arr;
};

/**
 * get image from Uinit8Array
 * @param {*} arr 
 * @returns 
 */
imgsdk.imageFromUint8Array=async (arr)=>{
  return new Promise( (resolve, reject) => {
    if(!arr || ! arr.buffer) reject(new Error('input arr not Uinit8Array'));
    var img=new Image();
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('could not load image'))
    img.src=URL.createObjectURL(
        new Blob([arr.buffer], { type: 'image/jpg' } /* (1) */)
    );
  })
}

/**
 * debug for awsm append mat to body
 * @param {*} path 
 * @returns 
 */
imgsdk.viewMat=function(path){
    if(!imgsdk.waModule) return;
    if(imgsdk.isWorker()) return;
    const arr = imgsdk.waModule.FS.readFile(path);
    var img=new Image();
    img.src=URL.createObjectURL(
        new Blob([arr.buffer], { type: 'image/jpg' })
    );
    document.body.appendChild(img);
    imgsdk.waModule.FS.unlink(path);
}


/**
 * init wasm module
 * @returns 
 */
imgsdk.init=async function(){
  if(imgsdk.waModule) return;
  try{
    imgsdk.log("start imgsdk init !")
    imgsdk.waModule=await WAModule();
    imgsdk.log("end imgsdk init !")
  }catch(e){
    imgsdk.log("imgsdk init exception !");
  }
  return;
}

imgsdk.validateInput=async function(options){
  var obj={code:-1,mess:"Input invalid !"}
  if(!imgsdk.waModule){
    obj.code=-3;
    obj.mess="Wasm module not init !";
    return obj;
  }

  if(!options || !imgsdk.isObject(options)) {
    obj.mess="Input options is null or not object !";
    return obj;
  }
  
  if(!options.token || !imgsdk.isString(options.token)){
    obj.mess="Input options token is null or not string !";
    return obj;
  }

  if(!options.src){
    obj.mess="Input options.src is null!";
    return obj;
  }

  obj.imagedata=null;
  if(options.src instanceof Uint8Array) {
    obj.imagedata=options.src;
  }

  if(imgsdk.isString(options.src)){
    if(options.src.indexOf("#")==0){
       if(imgsdk.isWorker) {
          obj.mess="Input options.src id element not work in webworker !";
          return obj;
       }else{
          options.src=document.getElementById(options.src.substr(1,options.src.length));
       }
    }else{
        //get url 
        const response = await fetch(options.src);
        if(response.status>=400){
          obj.mess="Input options.input_src get error from remote "+options.src;
        }else{
          const buffer = await response.arrayBuffer();
          obj.imagedata=new Uint8Array(buffer);
        }
    }
  }

  if(options.src instanceof HTMLCanvasElement 
    || options.src instanceof HTMLImageElement 
    || options.src instanceof Image){
        
        var tmpCv=document.createElement("canvas");
        tmpCv.width=options.src.width; 
        tmpCv.height=options.src.height;
        var tmpCtx=tmpCv.getContext("2d");
        tmpCtx.drawImage(options.src,0,0,tmpCv.width,tmpCv.height,0,0,tmpCv.width,tmpCv.height);
        imgsdk.log("start input image element ! ");
        let blob = await new Promise(resolve => tmpCv.toBlob(resolve, 'image/png',0.5));
        imgsdk.log("end input image element ! ");
        const buffer = await blob.arrayBuffer();
        //var buffer= tmpCtx.getImageData(0, 0, tmpCv.width, tmpCv.height);
        obj.imagedata=new Uint8Array(buffer);   
        
  }

  if(!obj.imagedata){
      obj.mess="Input options.src not valid !";
      return obj;
  }

  obj.code=0;
  obj.mess="input valid";
  return obj;
}

/**
 * call wasm findPaper function 
 * @param {*} input 
 * @param {*} isWarp 
 * @param {*} width 
 * @param {*} height 
 * @param {*} token 
 * @returns 
 */
imgsdk._findPaper=async function(imgdata,isWarp,width,height,token){
  try{
    var obj={
      code:0,
      mess:"Found page !"
    }
    imgsdk.log("findPaper start ! ");  
    var path_in="findPaper_in_"+new Date().getTime()+".png";
    var path_out="findPaper_out_"+new Date().getTime()+".png";
    imgsdk.waModule.FS.writeFile(path_in, imgdata);
    imgsdk.log("findPaper call wasm !");
    const str = imgsdk.waModule.ccall('findPaper', 'string', ["string","string","bool","number","number","string"], [path_in,path_out,isWarp,width,height,token]);
    var arr=str.split("_");
    obj.code=Number(arr[0]);
    if(obj.code==-1) obj.mess="Input Token not valid !";
    if(obj.code==1) obj.mess="Not found page !"; 

    if(obj.code!=0) {
      imgsdk.waModule.FS.unlink(path_in);  
      return obj;
    }
    
    //process ok 
    var arr_img_out = imgsdk.waModule.FS.readFile(path_out);
    if(imgsdk.isWorker()) img_out=arr_img_out;
    else img_out=await imgsdk.imageFromUint8Array(arr_img_out);  
    obj.img_out=img_out;
    obj.img_in=await imgsdk.imageFromUint8Array(imgdata);
    delete obj.imagedata;
    obj.top={x:Number(arr[1]),y:Number(arr[2])};
    obj.left={x:Number(arr[3]),y:Number(arr[4])};
    obj.bottom={x:Number(arr[5]),y:Number(arr[6])};
    obj.right={x:Number(arr[7]),y:Number(arr[8])};

    imgsdk.waModule.FS.unlink(path_in);
    imgsdk.waModule.FS.unlink(path_out);

    return obj;
  }catch(e){
    imgsdk.log("imgsdk finder exception ! "+e.message);
    return {code:-4 ,mess:"imgsdk finder exception ! "+e.message}
  }
}


/**
 * Public API findPaper 
 * @param {*} input 
 * @param {*} token 
 * @returns 
 */
imgsdk.findPaper=async function(options){
  var obj=await imgsdk.validateInput(options);
  if(obj.code!=0) return obj;
  return imgsdk._findPaper(obj.imagedata,false,240,320,obj.token);
}


/**
 * Public API warpPaper
 * 
 * @returns 
 */
imgsdk.warpPaper=async function(options){
  try{
    imgsdk.log("warpPaper start ! ");

    var obj=await imgsdk.validateInput(options);
    if(obj.code!=0) return obj;

    if(!options.width || !imgsdk.isNumber(options.width) || Number(options.width)<0) {
      obj.code=-1;
      obj.mess="Input options width not valid !";
      return obj;
    }
  
    if(!options.height || !imgsdk.isNumber(options.height) || Number(options.height)<0) {
      obj.code=-1;
      obj.mess="Input options height not valid !";
      return obj;
    }

    if(!options.top || !imgsdk.isNumber(options.top.x) || !imgsdk.isNumber(options.top.y) 
    || Number(options.top.x)<0 || Number(options.top.y)<0) {
      obj.code=-1;
      obj.mess="Input options top not valid !";
      return obj;
    }

    if(!options.left || !imgsdk.isNumber(options.left.x) || !imgsdk.isNumber(options.left.y)
    || Number(options.left.x)<0 || Number(options.left.y)<0) {
      obj.code=-1;
      obj.mess="Input options left not valid !";
      return obj;
    }

    if(!options.bottom || !imgsdk.isNumber(options.bottom.x) || !imgsdk.isNumber(options.bottom.y)
    || Number(options.bottom.x)<0 || Number(options.bottom.y)<0) {
      obj.code=-1;
      obj.mess="Input options bottom not valid !";
      return obj;
    }

    if(!options.right || !imgsdk.isNumber(options.right.x) || !imgsdk.isNumber(options.right.y)
    || Number(options.right.x)<0 || Number(options.right.y)<0) {
      obj.code=-1;
      obj.mess="Input options right not valid !";
      return obj;
    }


    var path_in="warpPaper_in_"+new Date().getTime()+".png";
    var path_out="warpPaper_out_"+new Date().getTime()+".png";
    imgsdk.waModule.FS.writeFile(path_in, obj.imagedata);
    imgsdk.log("warpPaper call wasm !");
    const str = imgsdk.waModule.ccall('warpPaper', 'string', ["string","string","int","int","int","int","int","int","int","int","int","int","string"], [path_in,path_out,options.top.x,options.top.y,options.left.x,options.left.y,options.bottom.x,options.bottom.y,options.right.x,options.right.y,options.width,options.height,options.token]);
    var arr=str.split("_");
    obj.code=Number(arr[0]);
    if(obj.code==-1) obj.mess="Input Token not valid !";
    if(obj.code==1) obj.mess="Not found page !"; 

    if(obj.code!=0) {
      imgsdk.waModule.FS.unlink(path_in);  
      return obj;
    }
    
    //process ok
    var arr_img_out = imgsdk.waModule.FS.readFile(path_out);
    if(imgsdk.isWorker()) img_out=arr_img_out;
    else img_out=await imgsdk.imageFromUint8Array(arr_img_out);  

    obj.img_in=await imgsdk.imageFromUint8Array(obj.imagedata);  
    imgsdk.waModule.FS.unlink(path_in);
    imgsdk.waModule.FS.unlink(path_out);
    obj.img_out=img_out; 
    delete obj.imagedata
    return obj;
    
  }catch(e){
    imgsdk.log("imgsdk warp exception ! "+e.message);
    return {code:-4 ,mess:"imgsdk warp exception ! "+e.message}
  }
}


/**
 * Public API filterPaper
 * @param {*} input 
 * @param {*} token 
 */
imgsdk.filterPaper=function(input,token){

}


/**
 * Public API blockPaper
 * @param {*} input 
 * @param {*} token 
 */
imgsdk.blockPaper=function(input,token){

}


/**
 * Public API findWarpPaper
 * @param {*} input 
 * @param {*} width 
 * @param {*} height 
 * @param {*} token 
 * @returns 
 */
imgsdk.findWarpPaper=async function(options){
  var obj=await imgsdk.validateInput(options);
  if(obj.code!=0) return obj;

  if(!options.width || !imgsdk.isNumber(options.width) || Number(options.width)<0) {
    obj.code=-1;
    obj.mess="Input options width not valid !";
    delete obj.imagedata;
    return obj;
  }

  if(!options.height || !imgsdk.isNumber(options.height) || Number(options.height)<0) {
    obj.code=-1;
    obj.mess="Input options height not valid !";
    delete obj.imagedata;
    return obj;
  }
  
  return imgsdk._findPaper(obj.imagedata,true,options.width,options.height,options.token);
}


/**
 * Public API findWarpFilterPaper
 * @param {*} input 
 * @param {*} token 
 */
imgsdk.findWarpFilterPaper=function(input,token){

}


/**
 * Public API findWarpFilterBlockPaper
 * @param {*} input 
 * @param {*} token 
 */
imgsdk.findWarpFilterBlockPaper=function(input,token){

}


imgsdk.processPaper=function(input,token){

}

imgsdk.processAnswerSheet= async function(options){
  imgsdk.log("processAnswerSheet start ! ");
  //try{
    var obj=await imgsdk.validateInput(options);
    obj.StudentId="";
    obj.Answers="";
    obj.ExamId="";
    if(obj.code!=0) return obj;

    var path_in="processAnswerSheet_in_"+new Date().getTime()+".ext";
    var path_out="processAnswerSheet_out_"+new Date().getTime()+".png";
    imgsdk.waModule.FS.writeFile(path_in, obj.imagedata);
    imgsdk.log("processAnswerSheet call wasm !");
    const str = imgsdk.waModule.ccall('processAnswerSheet', 'string', ["string","string","string"], [path_in,path_out,options.token]);
    var arr=str.split("_");
    obj.code=Number(arr[0]);
  
    if(obj.code<0) {
      obj.mess="Some thing wrong , could not process !";
      imgsdk.waModule.FS.unlink(path_in);  
      delete obj.imagedata
      return obj;
    }
    
    var pageStr=arr[1];
    var page=SheetParser.parse(",",pageStr);
    
    //process ok
    var arr_img_out = imgsdk.waModule.FS.readFile(path_out);
    if(imgsdk.isWorker()) img_out=arr_img_out;
    else img_out=await imgsdk.imageFromUint8Array(arr_img_out);  

    obj.img_in=await imgsdk.imageFromUint8Array(obj.imagedata);  
    imgsdk.waModule.FS.unlink(path_in);
    imgsdk.waModule.FS.unlink(path_out);
    obj.img_out=img_out; 
    delete obj.imagedata

    //parse page result 
    obj.code=page.errorCodes;
    if(page.errorCodes==1){
       obj.mess="Could not detect paper ! ";
    }
    if(page.errorCodes==2){
       obj.mess="Could not detect four conner sheet! ";
    }
    if(page.errorCodes==3){
      obj.mess="Could not detect four conner table answer ! ";
    }
    if(page.errorCodes==0){
      obj.mess="Process success ! ";
      var result=SheetParser.toResult(page);
      obj.StudentId=result.StudentId;
      obj.ExamId=result.ExamId;
      obj.Answers=result.Answers;
    }

    return obj;
 // }catch(e){
 //   imgsdk.log("imgsdk processAnswerSheet exception ! "+e.message);
 //   return {code:-4 ,mess:"imgsdk processAnswerSheet exception ! "+e.message}
 // }
}

/****** SheetParser *********/
var SheetParser ={};
SheetParser.SheetRect_Len=4;
SheetParser.SheetRect=function(){
  return {x:0,y:0,width:0,height:0}
}

SheetParser.SheetPoint_Len=2;
SheetParser.SheetPoint=function(){
  return {x:0,y:0}
}

SheetParser.SheetCircleAnswer_Len=4;
SheetParser.SheetCircleAnswer=function(){
  return {x:0,y:0,radius:0,isFill:0}
}

SheetParser.SheetRegion_Len=1+3*SheetParser.SheetRect_Len;
SheetParser.SheetRegion=function(){
  return{
    type:0,
    template:SheetParser.SheetRect(),
    bounding:SheetParser.SheetRect(),
    outputRect:SheetParser.SheetRect()
  }
}

SheetParser.SheetTable_Len=2+SheetParser.SheetRect_Len+4*SheetParser.SheetRegion_Len+3;
SheetParser.SheetTable=function(){
    return{
      name:"",
      type:0,
      bounding:SheetParser.SheetRect(),
      topRegion:SheetParser.SheetRegion(),
      leftRegion:SheetParser.SheetRegion(),
      bottomRegion:SheetParser.SheetRegion(),
      rightRegion:SheetParser.SheetRegion(),
      circleAnswerRadius:0,
      cols:0,
      rows:0,
      outputCircleAnswers:[],
    }
}

SheetParser.PageSize_Len=2+4*SheetParser.SheetPoint_Len;
SheetParser.PageSize=function(){
  return{
    page_width:0,
    page_height:0,
    top_point:SheetParser.SheetPoint(),
    left_point:SheetParser.SheetPoint(),
    bottom_point:SheetParser.SheetPoint(),
    right_point:SheetParser.SheetPoint(),
  }
}

SheetParser.SheetPage_Len=1+SheetParser.SheetRect_Len+SheetParser.PageSize_Len+4*SheetParser.SheetRegion_Len+4;
SheetParser.SheetPage=function(){
    return{
       id:0,
       bounding:SheetParser.SheetRect(),
       pageSize:SheetParser.PageSize(),
       topRegion:SheetParser.SheetRegion(),
       leftRegion:SheetParser.SheetRegion(),
       bottomRegion:SheetParser.SheetRegion(),
       rightRegion:SheetParser.SheetRegion(),
       wrapWidth:0,
       wrapHeight:0,
       outputSheetTables:[],
       outputImageSize:0,
       errorCodes:0,
    }
}
SheetParser.parse=function(pattern,content){
  var inst=new SheetParser.inst(pattern,content);
  return inst.readPage();
}
SheetParser.toResult=function(page){
  var result={
    StudentId:"",
    ExamId:"",
    Answers:"",
  }
  var charAnswer=["A","B","C","D","E","F"];

  for(var i=0;i<page.outputSheetTables.length;i++){
     var table=page.outputSheetTables[i];
     if(table.name=="StudentID"){
          for(var col=0;col<table.cols;col++){
            var rowFilled=-1;
            for(var row=0;row<table.rows;row++){
              var index=row*table.cols+col;
              if(table.outputCircleAnswers[index].isFill==1) rowFilled=row;
            }
            result.StudentId+=(rowFilled==-1)? ",":rowFilled+",";         
          }
     }

     if(table.name=="ExamID"){
          for(var col=0;col<table.cols;col++){
            var rowFilled=-1;
            for(var row=0;row<table.rows;row++){
              var index=row*table.cols+col;
              if(table.outputCircleAnswers[index].isFill==1) rowFilled=row;
            }
            result.ExamId+=(rowFilled==-1)? ",":rowFilled+",";   
          }
      }

      if(table.name.indexOf("Answer")>=0){
        for(var row=0;row<table.rows;row++){
            var colFilled=-1;
            for(var col=0;col<table.cols;col++){
              var index=row*table.cols+col;
              if(table.outputCircleAnswers[index].isFill==1) colFilled=col;
            }
            result.Answers+=(colFilled==-1)? ",":charAnswer[colFilled]+",";  
        }
      }
  } 

  return result;
}


SheetParser.inst=function(pattern,content){
  if(!pattern || !imgsdk.isString(pattern) || !content || !imgsdk.isString(content)) {
    throw Error("input sheetparser not valid !");
  }
  this.arr=content.split(pattern);
  this.cursor=0;
  
  
  this.readNumber=function(){
      if(this.cursor>this.arr.length-1) return NaN
      var n=Number(this.arr[this.cursor]);
      this.cursor++;
      return n;
  }
  this.readString=function(){
    if(this.cursor>this.arr.length-1) return "";
    var n=this.arr[this.cursor].toString();
    this.cursor++;
    return n;
  }

  this.readPoint=function(){
    if(this.cursor>this.arr.length-SheetParser.SheetPoint_Len) return null;
    var result={
      x:this.readNumber(),
      y:this.readNumber()
    }
    return result;
  }

  this.readSheetCircleAnswer=function(){
    if(this.cursor>this.arr.length-SheetParser.SheetCircleAnswer_Len) return null;
    var result={
      isFill:this.readNumber(),
      x:this.readNumber(),
      y:this.readNumber(),
      radius:this.readNumber() 
    }
    return result; 
  }

  this.readRect=function(){
    if(this.cursor>this.arr.length-SheetParser.SheetRect_Len) return null;
    var result={
      x:this.readNumber(),
      y:this.readNumber(),
      width:this.readNumber(),
      height:this.readNumber(),
    }
    return result;
  }

  this.readRegion=function(){
    if(this.cursor>this.arr.length-SheetParser.SheetRegion_Len) return null;
    var result={
      type:this.readNumber(),
      template:this.readRect(),
      bounding:this.readRect(),
      outputRect:this.readRect()
    }
    return result;
  }

  this.readTable=function(){
    if(this.cursor>this.arr.length-SheetParser.SheetTable_Len) return null;
    var result={
      name:this.readString(),
      type:this.readNumber(),
      bounding:this.readRect(),
      topRegion:this.readRegion(),
      leftRegion:this.readRegion(),
      bottomRegion:this.readRegion(),
      rightRegion:this.readRegion(),
      cols:this.readNumber(),
      rows:this.readNumber(),
      circleAnswerRadius:this.readNumber(),
      outputCircleAnswers:[],
    }
    var listLength=this.readNumber();
    for(var i=0;i<listLength;i++){
      result.outputCircleAnswers.push(this.readSheetCircleAnswer());
    }
    return result;
  }

  this.readPageSize=function(){
    if(this.cursor>this.arr.length-SheetParser.PageSize_Len) return null;
    var result={
      page_width:this.readNumber(),
      page_height:this.readNumber(),
      top_point:this.readPoint(),
      left_point:this.readPoint(),
      bottom_point:this.readPoint(),
      right_point:this.readPoint(),
    }
    return result;
  }

  this.readPage=function(){
    if(this.cursor>this.arr.length-SheetParser.SheetPage_Len) return null;
    var result={
       id:this.readNumber(),
       wrapWidth:this.readNumber(),
       wrapHeight:this.readNumber(),
       bounding:this.readRect(),
       pageSize:this.readPageSize(),
       topRegion:this.readRegion(),
       leftRegion:this.readRegion(),
       bottomRegion:this.readRegion(),
       rightRegion:this.readRegion(),
       outputSheetTables:[],
       outputImageSize:0,
       errorCodes:0,
    }
    var listLength=this.readNumber();
    for(var i=0;i<listLength;i++){
      result.outputSheetTables.push(this.readTable());
    }

    result.outputImageSize=this.readNumber();
    result.errorCodes=this.readNumber();
    return result;
  }

}

/*******SheetParser  ********/