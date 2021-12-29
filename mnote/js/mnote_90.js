/**
 * 
 */
 $('textarea').each(function () {
    this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
  }).on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

var globalInitMnote=false;
function getOs(){
    var userAgent=navigator.userAgent.toLowerCase();
    //if(userAgent.indexOf("ios,ipad"))
    var ios=/iphone|ipod|ipad/.test( userAgent );
    var android=/android/.test(userAgent);
    var safari = /safari/.test( userAgent );
    if(android){
        return "android";
    }else if(ios){
        return "ios";
    }else{
        return "web"
    }
} 
function replaceTV(str){
    return str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/\ /g, '-').replace(/đ/g, "d").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g,"o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g,"i");
}
function showLoading(){
    $(".loading").css("display","block");
}
function hideLoading(){
    $(".loading").css("display","none");
}
    
var roundedPoly = function(ctx,points,radius){
    var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut;
    var asVec = function (p, pp, v) { // convert points to a line with len and normalised
        v.x = pp.x - p.x; // x,y as vec
        v.y = pp.y - p.y;
        v.len = Math.sqrt(v.x * v.x + v.y * v.y); // length of vec
        v.nx = v.x / v.len; // normalised
        v.ny = v.y / v.len;
        v.ang = Math.atan2(v.ny, v.nx); // direction of vec
    }
    v1 = {};
    v2 = {};
    len = points.length;                         // number points
    p1 = points[len - 1];                        // start at end of path
    for (i = 0; i < len; i++) {                  // do each corner
        p2 = points[(i) % len];                  // the corner point that is being rounded
        p3 = points[(i + 1) % len];
        // get the corner as vectors out away from corner
        asVec(p2, p1, v1);                       // vec back from corner point
        asVec(p2, p3, v2);                       // vec forward from corner point
        // get corners cross product (asin of angle)
        sinA = v1.nx * v2.ny - v1.ny * v2.nx;    // cross product
        // get cross product of first line and perpendicular second line
        sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny; // cross product to normal of line 2
        angle = Math.asin(sinA);                 // get the angle
        radDirection = 1;                        // may need to reverse the radius
        drawDirection = false;                   // may need to draw the arc anticlockwise
        // find the correct quadrant for circle center
        if (sinA90 < 0) {
            if (angle < 0) {
                angle = Math.PI + angle; // add 180 to move us to the 3 quadrant
            } else {
                angle = Math.PI - angle; // move back into the 2nd quadrant
                radDirection = -1;
                drawDirection = true;
            }
        } else {
            if (angle > 0) {
                radDirection = -1;
                drawDirection = true;
            }
        }
        halfAngle = angle / 2;
        // get distance from corner to point where round corner touches line
        lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
        if (lenOut > Math.min(v1.len / 2, v2.len / 2)) { // fix if longer than half line length
            lenOut = Math.min(v1.len / 2, v2.len / 2);
            // ajust the radius of corner rounding to fit
            cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
        } else {
            cRadius = radius;
        }
        x = p2.x + v2.nx * lenOut; // move out from corner along second line to point where rounded circle touches
        y = p2.y + v2.ny * lenOut;
        x += -v2.ny * cRadius * radDirection; // move away from line to circle center
        y += v2.nx * cRadius * radDirection;
        // x,y is the rounded corner circle center
        ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection); // draw the arc clockwise
        p1 = p2;
        p2 = p3;
    }
    ctx.closePath();
}
window.addEventListener("message", function (event) {
    //console.log("receive data "+JSON.stringify(event.data));
    if(event.data){
        if(event.data.cmd && event.data.cmd=="initMNote"){
           // if (event.data.cmd=="initMnote"){
                if(event.data.pages && !window.globalInitMnote){
                    //mnote.addPages(event.data.pages);
                    window.globalInitMnote=true;
                     mnote=MNote.getInstance();
                     if(mnote && mnote.mnotedata==null) {
                          mnote.initNote(event.data);   
                     }
                  }
            //}
            /*if(event.data.cmd=="uploadImage"){
                if(event.data.url && event.data.indexImage){
                    mnote=MNote.getInstance();
                    mnote.updateSaveImage(event.data.url,event.data.indexImage); 
                }
            }*/
            
        }
        if(event.data.cmd && event.data.cmd=="MNoteStaticText"){
            mnote=MNote.getInstance();
            mnote.staticTextConfig=JSON.parse(event.data.data);
            if(localStorage){
                localStorage.setItem("staticTextConfig",JSON.stringify(mnote.staticTextConfig));
            }
        }

        if(event.data.cmd && event.data.cmd=="getMNoteJson"){
           var data=mnote.exportJSON();
           if(data.pages.length>0){
                parent.postMessage({cmd:"MNoteJson",data:data},"*"); 
           }else{
                parent.postMessage({cmd:"MNoteJson",data:data},"*"); 
               //exportPdf_();
               //alert("Có lỗi xảy ra trong quá trình lưu dữ liệu , vui lòng liên hệ và gửi ảnh lỗi tới ban quản trị !");
           }
           
        }
    }  
});

function drawArrowhead(context, from, to, radius) {
	var x_center = to.x;
	var y_center = to.y;

	var angle;
	var x;
	var y;
    context.save();
    context.fillStyle=context.strokeStyle;
	context.beginPath();

	angle = Math.atan2(to.y - from.y, to.x - from.x)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.moveTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.lineTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius *Math.cos(angle) + x_center;
	y = radius *Math.sin(angle) + y_center;

	context.lineTo(x, y);

	context.closePath();

    context.fill();
    context.restore();
}

parent.postMessage("MNoteLoadComplete","*"); 

function is_touch_device() {
    var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    return supportsTouch;
}
function isDomVisile(dom){
    if($(dom).css("display")=="none") return false;
    return true;
}
function dragMoveListener (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

function initNote(arrImage){
    mnote.addPages(arrImage);
}
function exportJSON(){
    var data=mnote.exportJSON();
    if(data.pages.length>0){
        parent.postMessage({cmd:"MNoteJson",data:data},"*"); 
    }else{
        parent.postMessage({cmd:"MNoteJson",data:data},"*"); 
       // exportPdf_();
       // alert("Có lỗi xảy ra trong quá trình lưu dữ liệu , vui lòng liên hệ và gửi ảnh lỗi tới ban quản trị !");    
    }
    
}

function exportPdf(){
    MNote.getInstance().exportPdf();
}
function exportPdf_(){
    MNote.getInstance().exportPdf_();
}

$(window).on("load",function() {

});

function initPanZoom(scale){
    var element = document.querySelector('#mnote_pages');

    // And pass it to panzoom
  var instance= panzoom(element, {
    beforeWheel: function(e) {
      // allow wheel-zoom only if altKey is down. Otherwise - ignore
      var shouldIgnore = !e.altKey;
      return shouldIgnore;
    },
    bounds: true,
    boundsPadding: 0.05,
    maxZoom: 3,
    minZoom: 1,
    pinchSpeed: 3,
    initialX: 0,
    initialY: 0,
    initialZoom: scale
  });
}

var MNote_instance=cc.Class.extend({
    appWidth:900,
    appHeight:1120,
    pageWidth:750,
    pageHeight:1120,
    pages:[],
    pageCount:0,
    pageScale:1,
    maxLineWidth:25,
    minLineWidth:1,
    maxTextSize:60,
    minTextSize:20,
    isDrawingMode:false,
    currDrawStyle:null,
    currTextStyle:null,
    currBrush:"pen",
    lastTouchX:-1,
    lastTouchY:-1,
    lastTouchDown:false,

    BRUSH_MOVE:"move",
    BRUSH_PEN:"pen",
    BRUSH_ERASE:"erase",
    BRUSH_TEXT:"text",
    BRUSH_POLYGON:"polygon",
    BRUSH_LINE:"line",
    BRUSH_RECTANGLE:"rangle",
    BRUSH_CIRCLE:"circle",
    BRUSH_ARROW:"arrow",

    canvasTouchStartX:-1,
    canvasTouchStartY:-1,
    canvasTouchStartTime:-1,
    canvasTapCount:0,

    aldreadyDelete:false,

    mode:"mode_normal",
    MODE_NORMAL:"mode_normal",
    MODE_DRAWRING:'mode_drawing',
    MODE_ENTER_TEXT:"mode_enter_text",
    MODE_EDIT_TEXT:"mode_edit_text",

    countRight:0,
    countWrong:0,
     arrImg:[],
     mnotedata:null,

     staticTextConfig:null,

     desktopZoom:1,

    ctor:function(){
        var self=this;
        this.note_pages=document.getElementById("mnote_pages");
        this.note_content=document.getElementById("mnote_content");
        this.note_container=document.getElementById("mnote_container");
        
        this.onresize(window.innerWidth,window.innerHeight);
        window.addEventListener("resize",()=>{
            this.onresize(window.innerWidth,window.innerHeight);
        })
        setTimeout(()=>{
            this.onresize(window.innerWidth,window.innerHeight,true);
        },2700)

        if(is_touch_device()){
            this.panzoom=panzoom(this.note_container, {
                beforeWheel: function(e) {
                  // allow wheel-zoom only if altKey is down. Otherwise - ignore
                  var shouldIgnore = !e.altKey;
                  return shouldIgnore;
                },
                onTouch: function(e) {
                    // `e` - is current touch event.
                    //if(mnote.mode==mnote.)
                    if(self.mnotedata.mode=="edit"){
                        return false; // tells the library to not preventDefault.
                    }else{
                        return true;
                    }
                    
                },
                smoothScroll: true,
                bounds: true,
                boundsPadding: 0.5,
                maxZoom: 4,
                minZoom: 1,
              });

              this.panzoom.on('transform',(e)=> {
                  if(this.mode==this.MODE_NORMAL){
                      var dom=document.getElementById("mnote_mark");
                      if(parseInt($(dom).css("top"))>self.appHeight){
                            var boundingBox=dom.getBoundingClientRect();
                            if(boundingBox.top<self.appHeight){
                                //$("#mnote_hold_bt").css("display","none");
                                //self.updateMark();
                            }else{
                               // if(self.mnotedata.mode=="edit") $("#mnote_hold_bt").css("display","flex");
                            }
                      }
                      
                  }
              });
            //this.panzoom.isDrawing=false; 
        }

        $("#mnote_help").css("display","block");
        $(".help_text").css("float","left");

        //$("#mnote_hold_bt").css("display","none");
        this.btnHoldDraw=document.getElementById("btn_hold_draw");
        $(this.btnHoldDraw).on("touchend mouseup",(e)=>{
            //this.enterDrawingMode();
            this.setMode(this.MODE_DRAWRING);
            e.preventDefault();
            
        });

        this.btnDrawFinish=document.getElementById("btn_draw_finish");
        this.btnDrawErase=document.getElementById("btn_draw_erase");
        this.btnDrawPen=document.getElementById("btn_draw_pen");
        this.btnDrawColor=document.getElementById("btn_draw_color");
        this.btnDrawText=document.getElementById("btn_draw_text");
        this.btnDrawMove=document.getElementById("btn_draw_move");


        $(this.btnDrawFinish).on("touchend mouseup",(e)=>{
            //this.exitDrawingMode();
            this.setMode(this.MODE_NORMAL);
            e.preventDefault();
        });

        $(this.btnDrawErase).on("touchend mouseup",(e)=>{
            if(this.currBrush==this.BRUSH_ERASE){
                this.showMenuColor();
            }else{
                this.setBrushDraw(this.BRUSH_ERASE);
            }
        });
        $(this.btnDrawText).on("touchend mouseup",(e)=>{
            this.setBrushDraw(this.BRUSH_TEXT); 
           // M.Toast.dismissAll();
           // M.toast({html: 'Tính năng đang phát triển'})
           //$("#capture").click();
           this.exportJSON();
        });
        $(this.btnDrawMove).on("touchend mouseup",(e)=>{
            this.setBrushDraw(this.BRUSH_MOVE); 
        });
        $(this.btnDrawPen).on("touchend mouseup",(e)=>{
            if(this.currBrush==this.BRUSH_PEN
              || this.currBrush==this.BRUSH_LINE 
              || this.currBrush==this.BRUSH_RECTANGLE
              || this.currBrush==this.BRUSH_CIRCLE
              || this.currBrush==this.BRUSH_ARROW){
                this.showMenuColor();
            }else{
                this.setBrushDraw(this.BRUSH_PEN);
            }
        });

        this.mnote_menu_color=document.getElementById("mnote_menu_color");
        this.menu_color_content=document.getElementById("menu_color_content");

        $(this.mnote_menu_color).on("touchend mouseup",(e)=>{
            this.hideMenuColor();
            e.stopPropagation();
        });
        $(this.menu_color_content).on("touchend mouseup",(e)=>{
            e.stopPropagation();
        });                

        this.currDrawStyle={
            alpha:1,
            lineWidth:6,
            strokeStyle:"red",
            fillStyle:"red"
        }
        this.currTextStyle={
            font:"font_chu_dep",
            size:20,
            align:"left",
            color:"red",
            fill:false
        }

        
        
        if(is_touch_device()){
            $("#mnote_app").css("overflow","hidden");
            $("#mnote_content").css("overflow","hidden");
            $("#bt_trash").css("left",(window.innerWidth/2-30)+"px");
            $("#bt_trash").css("top","0px");
            this.currDrawStyle.lineWidth=6;
        }else{
           // $("#mnote_app").css("overflow","scroll");
           $('body').attr("spellcheck",false);
           $("#mnote_content").css("overflow","scroll");
           $("#menu_text_font").css("transform","scale(1)");
           $("#bt_trash").css("left","0px");
           $("#mnote_setting_zoom_out").css("display","block");
           $("#mnote_setting_zoom_in").css("display","block");
           $("#bt_trash").css("top",window.innerHeight/2+"px");
           this.currDrawStyle.lineWidth=2;
           this.minTextSize=10;
        }

        try{
            if(localStorage){
                var textStyle=localStorage.getItem("textStyle");
                var drawStyle=localStorage.getItem("drawStyle");
               // console.log("get style "+textStyle+":"+drawStyle);
                if(drawStyle!="" && drawStyle!=undefined && drawStyle!=null) this.currDrawStyle=JSON.parse(drawStyle);
                if(textStyle!="" && textStyle!=undefined && textStyle!=null) this.currTextStyle=JSON.parse(textStyle);
            }
        }catch(e){
            console.log("exception "+e.toString());
        }

        this.initMenuBottom();
        this.initMenuText();
        this.initMarkUI();
        this.setBrushDraw(this.BRUSH_MOVE);
        

        //menu color
        this.contentBushPen=document.getElementById("content_brush_pen");
        this.contentBushLine=document.getElementById("content_brush_line");
        this.contentBushRect=document.getElementById("content_brush_rectangle");
        this.contentBushCircle=document.getElementById("content_brush_circle");
        this.contentBushArrow=document.getElementById("content_brush_arrow");

        $(this.contentBushPen).on("touchend mouseup",(e)=>{
            //this.setDrawStyle({alpha:1});
            this.setBrushDraw(this.BRUSH_PEN);
            e.preventDefault();
            e.stopPropagation();
        })

        $(this.contentBushLine).on("touchend mouseup",(e)=>{
            //this.setDrawStyle({alpha:0.5});
            this.setBrushDraw(this.BRUSH_LINE);
            e.preventDefault();
            e.stopPropagation();
        })

        $(this.contentBushRect).on("touchend mouseup",(e)=>{
            //this.setDrawStyle({alpha:0.5});
            this.setBrushDraw(this.BRUSH_RECTANGLE);
            e.preventDefault();
            e.stopPropagation();
        })

        $(this.contentBushCircle).on("touchend mouseup",(e)=>{
            //this.setDrawStyle({alpha:0.5});
            this.setBrushDraw(this.BRUSH_CIRCLE);
            e.preventDefault();
            e.stopPropagation();
        })

        $(this.contentBushArrow).on("touchend mouseup",(e)=>{
            //this.setDrawStyle({alpha:0.5});
            this.setBrushDraw(this.BRUSH_ARROW);
            e.preventDefault();
            e.stopPropagation();
        })

        this.thickSliderInput=document.getElementById("thick_slider_input");
        $(this.thickSliderInput).on("input",(e)=>{
            this.setDrawStyle({lineWidth:parseInt($(this.thickSliderInput).val())});
        });
        
        $(".btn-content-color").on("mouseup",function(e){
            self.setDrawStyle({strokeStyle:$(this).attr("data")});
            e.preventDefault();
            e.stopPropagation();
        })
        var self=this;
        $("#thick_slider").on("touchstart",function(e){
            self.sliderThickTouch(e);
            e.preventDefault();
            e.stopPropagation();
        })

        $("#thick_slider").on("touchmove",function(e){
            self.sliderThickTouch(e);
            e.preventDefault();
            e.stopPropagation();
        })

        

        this.setDrawStyle(this.currDrawStyle);

        this.setTextStyle(this.currTextStyle);

        $("#color_content_close").on("touchend mouseup",()=>{
            this.hideMenuColor();
        })

        $(".help_text").on("touchend mouseup",function(){
            $(this).css("display","none");
        });
        window.addEventListener('mouseup',(e)=>{
            this.lastTouchDown=false;
            var doms=$(".obj_down");
            if(doms.length>0){
                this._endObj(doms[0],e);
            }
            $(".obj_down").removeClass("obj_down");
            this.inactiveAllObj();

            if(!is_touch_device()){
                for(var i=0;i<this.pages.length;i++){
                    this.onCanvasEnd(document.getElementById("canvas_"+i));
                }
            }

            var cvslider=document.getElementById("slider_text_size");
            cvslider.isMouseDown=false;

            $("#mnote_menu_edit_bg").css("display","none");
            
        })
        window.addEventListener('mousemove',(e)=>{
            var objDown=$(".obj_down");
            if(objDown.length>0){
                this._moveObj($(objDown[0]).get(0),e);
            }
        })
        window.addEventListener("mousedown",(e)=>{
           // $("#mnote_menu_edit_bg").css("display","none");
        })
        

        document.getElementById("capture").addEventListener("change",(e)=>{
            let file = document.getElementById("capture").files[0];  // file from input
            if(!file )return;
                var self=this;
               var reader = new FileReader();
               reader.onload = function (e) {
                    self.addPage({
                        backgroundImage:e.target.result
                    });
                }
               reader.readAsDataURL(file);
        }) 

        
        $("#btn_save_data").on("touchstart mousedown",(e)=>{
            e.preventDefault();
        })

        $("#btn_save_data").on("touchend mouseup",(e)=>{
            var data=this.exportJSON();
            if(data.pages.length>0){
                parent.postMessage({cmd:"MNoteJson",data:data},"*"); 
            }else{
                parent.postMessage({cmd:"MNoteJson",data:data},"*"); 
                //exportPdf_();
                //alert("Có lỗi xảy ra trong quá trình lưu dữ liệu , vui lòng liên hệ và gửi ảnh lỗi tới ban quản trị !"); 
            }
            
            e.preventDefault();
        })

        $("#mnote_mark_result").on("touchstart mousedown",(e)=>{
            e.preventDefault();
        })

        /****update style */
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '@font-face {font-family: handwriting_font_z;src: url(css/HP0015HB.ttf);}';
        document.getElementsByTagName('head')[0].appendChild(style);

        $("#mark_comment_txt").css("font-family","handwriting_font_z");

        this.initStaticTextSetting();

        $("#setting_menu_static_text").click(()=>{
            if($("#setting_static_text").css("display")=="none"){
                this.showStaticTextSetting();
            }else{
                this.hideStaticTextSetting();
            }
        })

        $("#setting_menu_mathtype").click(()=>{
            this.showMathEditor();
        })


        var elems = document.querySelectorAll('.dropdown-trigger');
        var instances = M.Dropdown.init(elems, {
            alignment:"bottom",
            hover:false,
        });

        this.initMathEditor();

        $("#btn_resubmit").click(()=>{
            parent.postMessage({cmd:"MNoteReSubmit",data:{}},"*");
        })

        $("#mnote_setting_zoom_out").click(()=>{
            this.setDesktopZoom(this.desktopZoom-0.4);
        })
        $("#mnote_setting_zoom_in").click(()=>{
            this.setDesktopZoom(this.desktopZoom+0.4);
        })
        $("#mnote_menu_edit_bg_rotate").click((e)=>{
            $("#mnote_menu_edit_bg").css("display","none");
            var pageid=$("#mnote_menu_edit_bg").attr("data");
            this.rotateBgPage(pageid);
            e.preventDefault();
            e.stopPropagation();
        })
        $("#mnote_menu_edit_bg_moveup").click((e)=>{
            $("#mnote_menu_edit_bg").css("display","none");
            var pageid=$("#mnote_menu_edit_bg").attr("data");
            this.moveUpPage(pageid);
            e.preventDefault();
            e.stopPropagation();
        })
        $("#mnote_menu_edit_bg_movedown").click((e)=>{
            $("#mnote_menu_edit_bg").css("display","none");
            var pageid=$("#mnote_menu_edit_bg").attr("data");
            this.moveDownPage(pageid);
            e.preventDefault();
            e.stopPropagation();
        })
       /* $("#mnote_menu_edit_bg").on("mouseout",()=>{
            $("#mnote_menu_edit_bg").css("display","none");
        })*/


        $("#btn_comment_font").click(()=>{
            if($("#txtCommnetFont").css("display")=="block"){
                $("#txtCommnetFont").css("display","none");
                return;
            }else{
                /*var rect=document.getElementById("btn_comment_font").getBoundingClientRect();
                $("#txtCommnetFont").css("left",rect.left+"px");
                $("#txtCommnetFont").css("top",(rect.top+rect.height)+"px");*/
                $("#txtCommnetFont").css("display","block");
                return;
            }
        })
        var self=this;
        $(".txtCommnetFont").click(function(e){
            $("#mark_comment_txt").css("font-family",$(this).attr("value"));
            $("#txtCommnetFont").css("display","none");
            if(self.staticTextConfig){
                self.staticTextConfig.txtCommentFont=$(this).attr("value");
                if(localStorage){
                    try{
                        localStorage.setItem("staticTextConfig",JSON.stringify(self.staticTextConfig));
                    }catch(e){
                        //console.log("localstorage not support");
                    }
                }
            }
        })


        this.recognizing=false;
        this.final_transcript = ''
        //voice to text
    /*    if (!('webkitSpeechRecognition' in window)) {
            
        } else {
            this.setupVoiceToText();
            $("#bt_voice_text").css("display","block");

            $("#bt_voice_text").click(()=>{
                if(this.recognizing){
                        this.recognition.stop();
                        this.setButtonVoiceToText(false);
                        return;
                }else{
                    this.final_transcript = '';
                    this.recognition.start();
                    this.setButtonVoiceToText(true);
                    return;
                }
                
            })
          } */
    },

    setButtonVoiceToText:function(isOn){
        if(isOn){
            $("#bt_voice_text").removeClass("green");
            $("#bt_voice_text").addClass("red pulse");
        }else{
            $("#bt_voice_text").removeClass("red pulse");
            $("#bt_voice_text").addClass("green");
        }
    },
    linebreak:function(s) {
        var two_line = /\n\n/g;
        var one_line = /\n/g;
        return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    },
    capitalize:function(s) {
        var first_char = /\S/;
        return s.replace(first_char, function(m) { return m.toUpperCase(); });
    },
    setupVoiceToText:function(){
            this.recognition = new webkitSpeechRecognition();
            this.recognition.lang = "vi-VN";
            this.recognition.continuous = true;
            this.recognition.interimResults = true;

        var self=this;    
            
        this.recognition.onstart = function() {
            self.recognizing = true;
            self.setButtonVoiceToText(true);
          };
        
          this.recognition.onerror = function(event) {
            if (event.error == 'no-speech') {
               console.log("voice to text error no-speech");
            }
            if (event.error == 'audio-capture') {
                console.log("voice to text error audio-capture");
            }
            if (event.error == 'not-allowed') {
                console.log("voice to text error not-allowed");
            }
            self.recognizing=false;
            self.setButtonVoiceToText(false);
          };
        
          this.recognition.onend = function() {
            self.recognizing = false;
            self.setButtonVoiceToText(false);
          };
        
          this.recognition.onresult = function(event) {
            var interim_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                self.final_transcript += event.results[i][0].transcript;
              } else {
                interim_transcript += event.results[i][0].transcript;
              }
            }
           // self.final_transcript = self.capitalize(self.final_transcript);
        
            console.log("transcript "+self.final_transcript+":"+interim_transcript);
            $("#mark_comment_txt").val(self.final_transcript+":"+interim_transcript);
            self.resizeTxtComment();
          };
    },
    sliderThickTouch:function(e){
        if(e.touches.length<1) return;
            var touch=e.touches[e.touches.length-1];
            var slider=document.getElementById("thick_slider");
            var boundingBox=slider.getBoundingClientRect();
            var per=(touch.clientX-boundingBox.left)/boundingBox.width;
            per=(per<0)?0:per;
            per=(per>1)?1:per;
            $(this.thickSliderInput).val(Math.floor(2+per*33));
            var thumbActive=$(slider).find(".thumb")[0];
            $(thumbActive).css("left",Math.floor(per*boundingBox.width-5)+"px");
            this.setDrawStyle({lineWidth:parseInt($(this.thickSliderInput).val())});
            e.preventDefault();
            e.stopPropagation();
    },

    setDesktopZoom(zoom){
        if(zoom>=0.6 && zoom<=8){
            this.desktopZoom=zoom;
            $("#mnote_container").css("transform","scale("+this.desktopZoom+")");       
        }
    },


    initNote:function(data){
        //valide notedata 
        this.mnotedata=data;
        this.mnotedata.fullname="hoten";
        this.mnotedata.classname="lop";
        this.mnotedata.homework="baitap";
        this.mnotedata.homeworkTime="0000_00_00";
        //this.urlStaticCorrect=this.genStaticTextImage("đ","font_chu_dep",30,"red",50,50);
        //this.urlStaticWrong=this.genStaticTextImage("s","font_chu_dep",30,"red",50,50);

        //this.urlStaticCorrect="images/corect_mark_red.png";
        //this.urlStaticWrong="images/wrong_mark_red.png";


       // this.loadImageCorrect(this.staticTextConfig.urlImgCorrect,()=>{
         //   this.loadImageWrong(this.staticTextConfig.urlImgWrong,()=>{
            // //console.log("initMnote");
                if(data.staticTextConfig){
                    this.staticTextConfig=JSON.parse(data.staticTextConfig);
                    //console.log("set static text : "+JSON.stringify(this.staticTextConfig));
                }else{

                }

                if(data.student_obj && data.student_obj.fullName){
                    $("#mnote_user_name").html("Họ và tên : "+data.student_obj.fullName);
                    this.mnotedata.fullname=replaceTV(data.student_obj.fullName);
                }
                if(data.classroom_obj && data.classroom_obj.name){
                    $("#mnote_user_class").html("Lớp : "+data.classroom_obj.name);
                    this.mnotedata.classname=replaceTV(data.classroom_obj.name);
                }
                if(data.homework_obj && data.homework_obj.deadline){
                    var arr=data.homework_obj.deadline.split("T")[0];
                    var arr=arr.split("-")
                    $("#mnote_user_time").html("Ngày "+arr[2]+" tháng "+arr[1]+" năm "+arr[0]);
                    this.mnotedata.homeworkTime=arr[2]+"_"+arr[1]+"_"+arr[0];
                }
                if(data.homework_obj && data.homework_obj.content){
                    $("#mnote_user_homework").html(data.homework_obj.content);
                    this.mnotedata.homework=replaceTV(data.homework_obj.name.substr(0,50));
                }
                
                //set ordering if not
                for(var i=0;i<data.pages.length;i++){
                    //if(data.pages[i].order==undefined) data.pages[i].order=i;
                    if(data.pages[i].id==undefined) data.pages[i].id=i;
                }
                //sort ordering 
               /* for(var i=0;i<data.pages.length;i++)
                  for(var j=i;j<data.pages.lengthl;j++){
                      if(data.pages[i].order>data.pages[j].order){
                          var tmp=data.pages[j];
                          data.pages[j]=data.pages[i];
                          data.pages[i]=tmp;
                      }
                  }*/

                this.addPages(data.pages);
                if(data.comment){
                    $("#mark_comment_txt").val(data.comment);
                }
                if(data.point){
                    ////console.log("add number point "+data.point);
                    $("#mark_number_txt").val(data.point);
                }
                this.resizeTxtComment();

                if(data.commentEmoji){
                    this.addCommentEmoji(data.commentEmoji);
                }
                
                if(this.mnotedata.mode=="edit"){
                    var hideMark=false;
                    if(this.mnotedata.hideMark!=undefined && this.mnotedata.hideMark!=null) hideMark=this.mnotedata.hideMark
                    else{
                        try{
                            if(localStorage){
                                hideMark=(localStorage.getItem("hideMark")=="true")?true:false;
                            }
                        }catch{
    
                        }
                    }
                    if(hideMark) this.hideMark(true)
                    else this.showMark(true);
                    
                    /*if(this.mnotedata.hideMark==true){
                        this.hideMark();
                    }else{
                        
                    }*/

                    try{
                        if(this.mnotedata.context=="exam"){
                            $("#mnote_mark").css("display","none");
                        }
                    }catch(e){

                    }
                }else{
                    if(!is_touch_device()){
                         $("#mark_comment_txt").attr("disabled","");
                         $("#mark_number_txt").attr("disabled","");
                    }
                    $("#mnote_mark_chose").css("display","none");
                    $("#btn_save_data").css("display","none");
                    $("#mnote_hold_bt").css("display","none");
                    $("#mnote_mark").css("top","0px");
                    $("#hide_mark").css("display","none");
                    $("#mnote_mark_hide").css("display","none");
                    var h=$("#mnote_mark_point").height()-10;
                    $("#mnote_pages").css("padding-top",h+"px");
                    $("#mnote_user_info").css("display","none");
                    $("#mnote_mark").on("touchend mousedown",(e)=>{
        
                    }),
                    $("#mnote_mark_result").css("display","none");
                    $("#mnote_setting_bt").css("display","none");
                    $("#mnote_setting_zoom_in").css("display","none");
                    $("#mnote_setting_zoom_out").css("display","none");
                    $("#mnote_mark_emoji_bt").css("display","none");
                    $("#mnote_help").css("display","none");
                    $("#mnote_mark_emoji_bt").css("display","none");
                    $(".bt-edit-bg").css("display","none");
        
                    if(this.mnotedata.hideMark==true){
                        this.hideMark();
                    }
                }

                if(this.staticTextConfig && this.staticTextConfig.txtCommentFont){
                    $("#mark_comment_txt").css("font-family",this.staticTextConfig.txtCommentFont);
                }else{
                    try{
                        if(localStorage){
                            var localStaticConfig=localStorage.getItem("staticTextConfig");
                            if(localStaticConfig){
                                this.staticTextConfig=JSON.parse(localStaticConfig);
                                //console.log("set static text : "+JSON.stringify(this.staticTextConfig));
                                if(this.staticTextConfig.txtCommentFont){
                                    $("#mark_comment_txt").css("font-family",this.staticTextConfig.txtCommentFont);
                                }
                            }
                        }
                    }catch(e){

                    }
                    
                }

                setTimeout(()=>{
                    if(this.mnotedata.mode=="edit") $("#mnote_hold_bt").css("display","flex");
                },500);  
          //  })     
        //})

        ////console.log("initMnoteEnd");
     },   
     resetNote:function(){
         this.removeAllPage();
     },
     addPages:function(pages){
         for(var i=0;i<pages.length;i++){
             this.addPage(pages[i]);
         }
     },

     addPage:function(page){
         //validate page info
 
         var self=this;
        
         //init ui 
         var pageid="page_"+page.id;
         var divpage=$('<div data="'+page.id+'" id="'+pageid+'" class="page"></div>');
         $(divpage).css("margin-top","5px");
         $(this.note_pages).append($(divpage));
         $(divpage).width(this.pageWidth-200);
         
         var divpage_bg=$('<div class="page_bg"></div>');
         $(divpage).append($(divpage_bg)); 

         var divpage_canvas_draw=$('<div class="page_canvas_draw"></div>');
         $(divpage).append($(divpage_canvas_draw));

         var divpage_objs_layer=$('<div class="page_objs_layer"></div>');
         $(divpage).append($(divpage_objs_layer));  
         $(divpage_objs_layer).css("pointer-events","none");

        var btEditBg=$('<i data="rotate" class="material-icons bt-edit-bg waves-effect waves-light" style="font-size:35px">crop_rotate</i>');
        var btEditBgMoveUp=$('<i data="moveup" class="material-icons bt-edit-bg waves-effect waves-light" style="right:50px;font-size:35px">arrow_upward</i>');
        $(divpage).append($(btEditBg));
        $(divpage).append($(btEditBgMoveUp));

         var canvas=document.createElement("canvas");
         canvas.id="canvas_"+page.id;
         canvas.index=page.id;
         canvas.pageid=page.id;
         canvas.style="position:absolute";
         $(canvas).addClass("canvas_draw");   
         this.addCanvasEventListener(canvas);

         var canvasDraw=document.createElement("canvas");
         canvasDraw.id="canvasDraw_"+page.id;
         canvasDraw.pageid=page.id;
         canvasDraw.style="position:absolute";
         $(divpage_canvas_draw).append(canvasDraw);
         $(divpage_canvas_draw).append(canvas);

         var needUpdateSize=false;
         var isVideoPage=false;   
         var length=page.backgroundImage.length;
        //check file type 
         var urlLowerCase=page.backgroundImage.toLowerCase();
         if(urlLowerCase.indexOf(".mp4")>=length-5
            || urlLowerCase.indexOf(".mov")>=length-5
            || urlLowerCase.indexOf(".wmv")>=length-5
            || urlLowerCase.indexOf(".webm")>=length-5
            || urlLowerCase.indexOf(".mp3")>=length-5
            || urlLowerCase.indexOf(".m4a")>=length-5
            || urlLowerCase.indexOf("player.vimeo")>=0
            || urlLowerCase.indexOf("mega.nz")>=0
          ){
             isVideoPage=true;
             canvas.pagetype=1;
         }else{
            canvas.pagetype=0;
         }

        // //console.log("add page :"+page.backgroundImage+":"+isVideoPage);

         if(!isNaN(page.width) && !isNaN(page.height)){
            self.resizePage(page.id,page.width,page.height);
         }else{
            needUpdateSize=true;
         }

         if(page.backgroundImage){

            if(isVideoPage){
                //video background
               // var videodiv=$('<video class="video-js" controls preload="auto" width="800" height="450"><source src="'+page.backgroundImage+'" type="video/mp4" /></video>');
               // $(divpage_bg).append($(videodiv));
               if(page.backgroundImage.indexOf("player.vimeo")>=0
                 || page.backgroundImage.indexOf("mega.nz")>=0){
                    $(divpage_bg).html('<iframe src="'+page.backgroundImage+'" width="100%" height=450 style="border:none"></iframe>');
               }else{
                    if(page.backgroundImage.indexOf("wewiin.nyc3.cdn")<0){
                        $(divpage_bg).html('<video id="video_'+page.id+'" class="video-js vjs-big-play-centered" controls preload="auto" width="100%" height="450" style="width:100%;height:450px"><source src="'+page.backgroundImage+'" type="video/mp4" /></video>');
                        videojs('video_'+page.id, {
                            controls: true,
                            autoplay: false,
                            preload: 'auto'
                        });
                    }else{
                        $(divpage_bg).html(" Chức năng video đang tạm khoá , vui lòng thử lại sau ! ");
                    }
               }
               self.resizePage(page.id,self.pageWidth,450,null);
               canvasDraw.style.pointerEvents="none";
               canvas.style.pointerEvents="none";
               $(canvas.parentNode).css("pointer-events","none");
            }else{
                var img=new Image();
                $(divpage_bg).append(img);
                this.arrImg.push(img);
                $(img).attr("pageid",page.id);
                $(img).attr("id","image_bg_"+page.id);
                $(img).attr("nl","1");
                img.crossOrigin = "anonymous";
                img.onload=function(){
                    if(!$(this).parent()) return;
                    //var id=parseInt($(this).parent().parent().attr("data"));
                    //alert("image size "+img.width+":"+img.height);
                    id=parseInt($(this).attr("pageid"));
                    var width=(self.pageWidth<img.width)? self.pageWidth:img.width;
                    var height=Math.floor(img.height* width/img.width);
                    img.width=width;
                    img.height=height;
                    //img.style.transform="scale(1)";
                    //img.style.transformOrigin="0% 0%";
                    //height=(height<9*self.pageWidth/16) ? 9*self.pageWidth/16:height;
                    // if(needUpdateSize) self.resizePage(id,self.pageWidth,height,img);
                    self.resizePage(id,self.pageWidth,height,img);
                    
                }
                img.onerror=function(){
                    if(Number($(this).attr("nl"))<4){
                        console.log("on load image error");
                        var imgsrc=$(this).attr("src");
                        if(imgsrc.indexOf("https://azotacdn.studybymusic.com")>=0){
                           imgsrc= imgsrc.replace("https://azotacdn.studybymusic.com","https://wewiin.nyc3.cdn.digitaloceanspaces.com");
                        }
                        
                        var self=this;
                        setTimeout(()=>{
                            console.log("load image :"+$(self).attr("src"));
                            $(self).attr("src",imgsrc+"?time="+new Date().getTime());
                        },400);
                    }
                    $(this).attr("nl",Number($(this).attr("nl"))+1);
                }
                setTimeout(()=>{
                    if(page.backgroundImage.indexOf("https://nextcdn.studybymusic.com")>=0){
                        page.backgroundImage= page.backgroundImage.replace("https://nextcdn.studybymusic.com","https://239444185.e.cdneverest.net");
                    }
                    img.src=page.backgroundImage;
                },400*Number(this.pageCount));
            }
         }else{
            var width=self.pageWidth;
            var height=4*width/3;
            self.resizePage(page.id,width,height,null);
         }
         if(page.draw){
            //page.draw=page.draw.replaceAll("https://cdn.azota.vn/api/download_public","https://wewiin.nyc3.cdn.digitaloceanspaces.com");
             //init draw
             var imgdraw=new Image();
             $(imgdraw).attr("pageid",page.id);
             $(imgdraw).attr("nl","1");
             imgdraw.onload=function(e){
                 var canvas=document.getElementById("canvas_"+parseInt($(img).attr("pageid")));
                 if(canvas){
                    canvas.setAttribute("hasDraw",true);
                     var ctx=canvas.getContext('2d');
                     ctx.drawImage(imgdraw,0,0);
                 }
             }
             imgdraw.onerror=function(){
                if(Number($(this).attr("nl"))<4){
                    console.log("on load image draw error");
                    var imgsrc=$(this).attr("src");
                    if(imgsrc.indexOf("https://azotacdn.studybymusic.com")>=0){
                       imgsrc= imgsrc.replace("https://azotacdn.studybymusic.com","https://wewiin.nyc3.cdn.digitaloceanspaces.com");
                    }
                    
                    var self=this;
                    setTimeout(()=>{
                        console.log("load image draw :"+$(self).attr("src"));
                        $(self).attr("src",imgsrc+"?time="+new Date().getTime());
                    },400);
                }
                $(this).attr("nl",Number($(this).attr("nl"))+1);
            }
             imgdraw.crossOrigin = "anonymous";
             setTimeout(()=>{
                if(page.draw.indexOf("https://nextcdn.studybymusic.com")>=0){
                    page.draw= page.draw.replace("https://nextcdn.studybymusic.com","https://239444185.e.cdneverest.net");
                }
                imgdraw.src=page.draw;
             },400*Number(this.pageCount));
         }else{
            var canvas=document.getElementById("canvas_"+parseInt($(img).attr("pageid")));
                 if(canvas){
                    canvas.setAttribute("hasDraw",false);
                 }
         }
         if(page.staticText && page.staticText.length>0){
             //init objs
             for(var i=0;i<page.staticText.length;i++){
                 this.addStaticText(page.id,page.staticText[i].value,page.staticText[i].x,page.staticText[i].y);
             }
         }
         if(page.objText && page.objText.length>0){
            //init objs
            for(var i=0;i<page.objText.length;i++){
                this._addText(page.id,page.objText[i].value,page.objText[i].x,page.objText[i].y,page.objText[i].textStyle);
            }
        }

      /*  setTimeout(function(){
            var img=new Image();
            img.src=page.backgroundImage+"?t=3";
            img.width=$("#mnote_answer").width();
            $("#mnote_answer_content").append(img);
        },1000);*/
        
        /*if(page.point && !isNaN()){
            $("#mark_number_txt").html(page.point);
        }
        if(page.comment){
            $("#mark_comment_txt").html(page.comment);
        }*/
        this.pageCount++;
        this.pages.push(page);
        // $("#mnote_hold_bt").css("display","flex");
 
     },
     exportJSON:function(){
        //var img=document.getElementById("canvas_0").toDataURL("image/jpeg",0.5);
        var mnotedata={};
        var pages=[];
        mnotedata.pages=pages;
        var divpage=$(".page");
        var self=this;
        $(divpage).each(function(e){
            //get imgbg
            var page={};
        
            var canvas=$(this).find(".canvas_draw")[0];
            page.width=canvas.width;
            page.height=canvas.height;
            page.id=Number($(this).attr("data"));
            
            console.log("export page "+canvas.pagetype+":"+page.id+":"+canvas.pageid);
            if(canvas.pagetype==0){
                var img=$(this).find("img")[0];
                page.backgroundImage=$(img).attr("src");
                page.rotation=parseInt($(img).attr("rotation"));
            }else{
                ////console.log("export bg video "+self.mnotedata.pages[canvas.pageid].backgroundImage+":"+canvas.pageid)
                var iframevideo=$(this).find("iframe")[0];
                if(iframevideo){
                    page.backgroundImage=iframevideo.src;
                }else{
                    var videotag=$(this).find("video")[0];
                    if(videotag){
                        page.backgroundImage=videotag.src;
                    }
                }
                
                //page.backgroundImage=self.mnotedata.pages[canvas.pageid].backgroundImage;
            }
            

            var objsDiv=$(this).find(".page_objs_layer")[0];
            //find static stext
            var staticText=$(objsDiv).find(".obj_static_text");
            page.staticText=[];
            for(var i=0;i<staticText.length;i++){
                var staticTextObj={};
                staticTextObj.x=parseInt($(staticText[i]).css("left"));
                staticTextObj.y=parseInt($(staticText[i]).css("top"));
                if($(staticText[i]).hasClass("wrong")){
                    staticTextObj.value="wrong";
                }else{
                    staticTextObj.value="correct";
                }
                page.staticText.push(staticTextObj);
            }
            var objText=$(objsDiv).find(".obj_text");
            page.objText=[];
            ////console.log("objText "+objText.length);
            for(var i=0;i<objText.length;i++){
                var obj={};
                obj.x=parseInt($(objText[i]).css("left"));
                obj.y=parseInt($(objText[i]).css("top"));
                obj.value=$(objText[i]).html();
                obj.textStyle=JSON.parse($(objText[i]).attr("styleText").replaceAll("'","\""));
                page.objText.push(obj);
            }
            if(canvas.pagetype==0){
                try{
                    if(canvas.getAttribute("hasDraw").toString()=="true"){
                        page.draw=canvas.toDataURL("image/png");
                    }
                }catch(e){
                    //console.log("export draw error "+e.toString());
                }   
            }
           // page.point=this.point;
           // page.comment=$("#mark_comment_txt").html();
            pages.push(page);
        });
        //console.log("export static text : "+JSON.stringify(this.staticTextConfig));
        mnotedata.staticTextConfig=JSON.stringify(this.staticTextConfig);
        try{
            localStorage.setItem("staticTextConfig",JSON.stringify(this.staticTextConfig));
        }catch(e){
            //console.log("localstorage not support");
        }
        
        mnotedata.comment=$("#mark_comment_txt").val();
        mnotedata.commentEmoji=[];
        var arr=$(".comment_emoji");
        for(var i=0;i<arr.length;i++){
            mnotedata.commentEmoji.push($(arr[i]).attr("src"));
        }
        mnotedata.point=$("#mark_number_txt").val();
        mnotedata.point=mnotedata.point.replaceAll(",",".");
        if(mnotedata.point==undefined || mnotedata.point==null || mnotedata.point=="" || isNaN(Number(mnotedata.point))) mnotedata.point=0;
        mnotedata.hideMark=this.mnotedata.hideMark;
        //if(this.mnotedata.hideMark) mnotedata.point=0
        cc.log("EXPORT JSON "+JSON.stringify(mnotedata));

        return mnotedata;
     },
     updateSaveImageSuccess:function(url,index){
        //update image 
     },
     updateSaveImage:function(index){
        //
     },
     updateAllImage:function(){
        //
     },
     removeAllPage:function(page){
         //remove all current page
         this.pageCount=0;
         this.pages=[];
         $("mnote_pages").empty();
     },
     removePage:function(page){
         //remove speicfy page
 
     },
     moveUpPage:function(pageid){
        var parentNode=document.getElementById("mnote_pages");
        var childNodes=parentNode.childNodes;
        var indexMove=-1;
        for(var i=0;i<childNodes.length;i++){
            if(childNodes[i].id=="page_"+pageid){
                indexMove=i;
            }
        }
        
        if(indexMove>1){
            var node1=childNodes[indexMove-1];
            var node=childNodes[indexMove];
            if($(node1).hasClass("page")){
                parentNode.insertBefore(node, node1);
            }
        }
     },
     moveDownPage:function(pageid){
        var parentNode=document.getElementById("mnote_pages");
        var childNodes=parentNode.childNodes;
        var indexMove=-1;
        for(var i=0;i<childNodes.length;i++){
            //console.log("childNodeId "+childNodes[i].id);
            if(childNodes[i].id=="page_"+pageid){
                indexMove=i;
            }
        }
        
        if(indexMove<childNodes.length-1){
            ////console.log("moveDownPage "+pageid+":"+indexMove);
            var node1=childNodes[indexMove+1];
            var node=childNodes[indexMove];
            if($(node1).hasClass("page")){
                //console.log("moveDownPage "+pageid+":"+indexMove);
                parentNode.insertBefore(node1, node);
            }
        }
     },


     resizePage:function(id,width,height,img){
         //
         //console.log("resize page "+id+":"+width+":"+height+":"+img);
         var divpage=$("#page_"+id);
         $("#page_"+id).css("width",width+"px");
         $("#page_"+id).css("height",height+"px");
        //resize bg image

        //resize canvas
        var canvas=document.getElementById("canvas_"+id);
        var canvasDraw=document.getElementById("canvasDraw_"+id);
        
        if(canvas.isUpdateSize!=true){
            canvas.width=width;
            canvas.height=height;
            canvasDraw.width=width;
            canvasDraw.height=height;
            canvas.isUpdateSize=true;
        }

        if(Math.floor(canvas.height)!=Math.floor(height)){
            //strange case 
            canvas.width=width;
            canvas.height=height;
            canvasDraw.width=width;
            canvasDraw.height=height;
            
            if(this.mnotedata.pages[id].draw){
                var drawimgurl=this.mnotedata.pages[id].draw;
                drawimgurl=drawimgurl.replaceAll("https://cdn.azota.vn/api/download_public","https://wewiin.nyc3.cdn.digitaloceanspaces.com");
                var imgdraw=new Image();
                $(imgdraw).attr("nl","1");
                imgdraw.onload=function(e){
                    var canvasStrange=document.getElementById("canvas_"+id);
                    if(canvasStrange){
                        var ctx=canvasStrange.getContext('2d');
                        ctx.drawImage(imgdraw,0,0);
                    }
                }
                imgdraw.onerror=function(){
                    if(Number($(this).attr("nl"))<4){
                        console.log("on load image draw error");
                        var imgsrc=$(this).attr("src");
                        if(imgsrc.indexOf("https://azotacdn.studybymusic.com")>=0){
                           imgsrc= imgsrc.replace("https://azotacdn.studybymusic.com","https://wewiin.nyc3.cdn.digitaloceanspaces.com");
                        }
                        if(imgsrc.indexOf("https://nextcdn.studybymusic.com")>=0){
                           imgsrc= imgsrc.replace("https://nextcdn.studybymusic.com","https://239444185.e.cdneverest.net");
                        }
                        
                        var self=this;
                        setTimeout(()=>{
                            console.log("load image draw :"+$(self).attr("src"));
                            $(self).attr("src",imgsrc+"?time="+new Date().getTime());
                        },400);
                    }
                    $(this).attr("nl",Number($(this).attr("nl"))+1);
                }
                imgdraw.crossOrigin = "anonymous";
                imgdraw.src=drawimgurl;
            }
        }
        

        //resize objs layer
        if(this.mnotedata.mode=="edit") $("#mnote_mark").css("top",($(this.note_pages).height()+40)+"px");
        //$("#mnote_mark").css("top","0px");

        //$(this.note_container).height($(this.note_pages).height()*this.pageScale+1.5*window.innerHeight);
        if(navigator.userAgent.toLowerCase().indexOf("ipad")>=0){
            $(this.note_container).height($(this.note_pages).height()*this.pageScale+1.5*window.innerHeight+500);
        }else{
            $(this.note_container).height($(this.note_pages).height()*this.pageScale+1.5*window.innerHeight);
        }
        
        if (this.mnotedata.mode=="edit" && getOs()=="web"){
            $(this.note_container).height($(this.note_container).height()+300);
        }

         //rotate image bg 
         
      //       var bgro=(isNaN(Number(this.mnotedata.pages[id].rotation)))? 0:Number(this.mnotedata.pages[id].rotation);
            var pageObj=null;
            for(var i=0;i<this.mnotedata.pages.length;i++){
                if(this.mnotedata.pages[i].id==id) pageObj=this.mnotedata.pages[i];
            }
            var bgro=0;
            if(pageObj){
                bgro=(isNaN(Number(pageObj.rotation)))? 0:Number(pageObj.rotation);
            }

            // var img=document.getElementById("image_bg_"+id);//$(divpage).find(".page_bg").find("img")[0];
            // //console.log('get image '+img);  
             var btEditBg=$(divpage).find(".bt-edit-bg");
             $(btEditBg).css("display","none");
             if(img!=null){
                $(img).attr("imgwidth",width);
                $(img).attr("imgheight",height);
                $(img).attr("rotation",bgro);
                this.rotateBgImage(img,bgro);
                if(this.mnotedata.mode=="edit"){
                    $(btEditBg).css("display","block");
                }
                var self=this;
                $(btEditBg).on("touchend mouseup",function(e){
                    if($(this).attr("data")=="rotate"){
                        self.rotateBgPage(Number($(this).parent().attr("data")));
                    }else{
                        self.moveUpPage(Number($(this).parent().attr("data")));
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                })
            }
         //}
     },
     rotateBgPage:function(pageid){
        var img=document.getElementById("image_bg_"+pageid);
        var bgro=parseInt($(img).attr("rotation"));
        bgro-=90;
        // //console.log("rotate to "+bgro);
        if(bgro<=-360) bgro=0;
        this.rotateBgImage(img,bgro);
     },

     rotateBgImage:function(img,rot){
         var width=parseInt($(img).attr("imgwidth"));
         var height=parseInt($(img).attr("imgheight"));
         //var ratio=height/width;
        $(img).css("transform","rotate("+rot+"deg)");
        $(img).attr("rotation",rot);
        if(rot==-90 || rot==-270){
          if(height>width){
            var ratio=height/width;
            img.height=width;
            img.width=Math.floor(width/ratio);
          }else{
            var ratio=width/height;
              img.width=height;
              img.height=Math.floor(height/ratio);
          }

          
        }else{
           img.width=width;
           img.height=height;
        }
     },

     addCanvasEventListener:function(canvas){
        if(this.mnotedata.mode!="edit") return;

        if(!is_touch_device()){
            canvas.addEventListener("mousedown",(e)=>{
                this.onCanvasTouchStart(e);
            });
            canvas.addEventListener("mousemove",(e)=>{
                this.onCanvasTouchMove(e);
            },false)
        }else{
            canvas.addEventListener("touchstart",(e)=>{
                this.onCanvasTouchStart(e);
            });
            canvas.addEventListener("touchmove",(e)=>{
                this.onCanvasTouchMove(e);
            },false)
            canvas.addEventListener("touchend",(e)=>{
                this.onCanvasTouchEnd(e);
            })
        }
        
      /*  canvas.addEventListener("mouseup",(e)=>{
            this.onCanvasTouchEnd(e);
        }) */

        
     },
     onCanvasTouchStart:function(event){
        cc.log("touch start");
        var canvas=event.currentTarget;
        var coor=this.getCoorTouchEvent(canvas,event);

        canvas.downing=true;
        canvas.downx=coor.x;
        canvas.downy=coor.y;
        canvas.downclientx=coor.clientX;
        canvas.downclienty=coor.clientY;
        canvas.lastmoveclientx=coor.clientX;
        canvas.lastmoveclienty=coor.clientY;
        canvas.lastmovex=coor.x;
        canvas.lastmovey=coor.y;
        canvas.lastmovex1=coor.x;
        canvas.lastmovey1=coor.y;
        canvas.downtime=new Date().getTime();
        canvas.movefar=false;


        if(this.mode==this.MODE_NORMAL){
            event.preventDefault();
            return;
        }
        if(this.mode==this.MODE_DRAWRING){
            var ctx=canvas.getContext("2d");
            ctx.moveTo(canvas.lastmovex,canvas.lastmovey);
            ctx.beginPath();
            if(this.currBrush!=this.BRUSH_MOVE && this.currBrush!=this.BRUSH_TEXT){
                $(".obj_text").css("pointer-events","none");
                $(".obj_static_text").css("pointer-events","none");
            }
            

            event.preventDefault();
            return;
        }
        if(this.mode==this.MODE_ENTER_TEXT){
            event.preventDefault();
            return;
        }
        if(this.mode==this.MODE_EDIT_TEXT){
            event.preventDefault();
            return;
        }

        
     },
     onCanvasTouchMove:function(event){
       // cc.log("touch move");
       var canvas=event.currentTarget;
       var canvasDraw=document.getElementById("canvasDraw_"+canvas.pageid);
       var coor=this.getCoorTouchEvent(canvas,event);
       
       if(canvas.downing){
           if(Math.abs(coor.x-canvas.downx)>30 || Math.abs(coor.y-canvas.downy)>30) canvas.movefar=true;
       }

       if(this.mode==this.MODE_NORMAL){
           canvas.lastmovex=coor.x;
           canvas.lastmovey=coor.y;
           canvas.lastmoveclientx=coor.clientX;
           canvas.lastmoveclienty=coor.clientY;
           // event.preventDefault();
            return;
        }
        if(this.mode==this.MODE_DRAWRING){
            var isMultitouch=false;
            if(event.touches && event.touches.length>1) isMultitouch=true;

            if((this.currBrush!=this.BRUSH_MOVE && this.currBrush!=this.BRUSH_TEXT) && canvas.downing && !isMultitouch){

                 //drawing pen , erase , polygon   
                if(Math.abs(coor.x-canvas.lastmovex)>1 || Math.abs(coor.y-canvas.lastmovey)>1){
                    //var ctx=canvas.getContext("2d");
                    //var ctxDraw=canvasDraw.getContext("2d");
                    if(this.currBrush==this.BRUSH_PEN || this.currBrush==this.BRUSH_ERASE){
                        ctx=canvas.getContext("2d");
                    }else{
                        ctx=canvasDraw.getContext("2d");
                    }
                    
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.strokeMiterLimit=1;
                    //ctx.shadowColor = "rgba(0,0,0,.5)";
                    ctx.globalAlpha=this.currDrawStyle.alpha;
                    ctx.strokeStyle=this.currDrawStyle.strokeStyle;
                    ctx.lineWidth=this.currDrawStyle.lineWidth;

                    if(this.currBrush==this.BRUSH_PEN){
                        ctx.globalCompositeOperation="source-over";
                        
                    }
                    if(this.currBrush==this.BRUSH_ERASE){
                        ctx.globalCompositeOperation="destination-out";
                        ctx.lineWidth=this.currDrawStyle.lineWidth*10;
                        ctx.lineWidth=(ctx.lineWidth<30)?30:ctx.lineWidth;
                    }

                    if(this.currBrush==this.BRUSH_PEN || this.currBrush==this.BRUSH_ERASE){
                        ctx.beginPath();    
                        if(!is_touch_device()){
                            ctx.moveTo(canvas.lastmovex,canvas.lastmovey);
                            //ctx.lineTo(coor.x,coor.y);
                            var xc = (canvas.lastmovex1 + coor.x) / 2;
                            var yc = (canvas.lastmovey1+coor.y) / 2;
                            ctx.quadraticCurveTo(canvas.lastmovex1, canvas.lastmovey1, xc, yc);
                            ctx.stroke();
                        }else{
                            ctx.moveTo(canvas.lastmovex1,canvas.lastmovey1);
                            ctx.lineTo(coor.x,coor.y);
                            ctx.stroke();
                        }
                    }else{
                        ctx.clearRect(0,0,canvas.width,canvas.height);
                        if(this.currBrush==this.BRUSH_LINE){
                            ctx.beginPath();  
                            ctx.moveTo(canvas.downx,canvas.downy);
                            ctx.lineTo(coor.x,coor.y);
                            ctx.stroke();
                        }
                        if(this.currBrush==this.BRUSH_RECTANGLE){
                            ctx.beginPath();  
                            var minx=Math.min(canvas.downx,coor.x);
                            var miny=Math.min(canvas.downy,coor.y);
                            var maxx=Math.max(canvas.downx,coor.x);
                            var maxy=Math.max(canvas.downy,coor.y);
                            ctx.rect(minx,miny,maxx-minx,maxy-miny);
                            ctx.stroke();
                        }
                        if(this.currBrush==this.BRUSH_CIRCLE){
                            ctx.beginPath();  
                            var radius=Math.floor(Math.sqrt((canvas.downx-coor.x)*(canvas.downx-coor.x)+(canvas.downy-coor.y)*(canvas.downy-coor.y)));
                            ctx.arc(canvas.downx, canvas.downy,radius, 0, 2 * Math.PI);
                            ctx.stroke();
                        }
                        if(this.currBrush==this.BRUSH_ARROW){
                            
                            ctx.beginPath();  
                            ctx.moveTo(canvas.downx,canvas.downy);
                            ctx.lineTo(coor.x,coor.y);
                            ctx.stroke();
                            drawArrowhead(ctx,{x:canvas.downx,y:canvas.downy},{x:coor.x,y:coor.y},3*ctx.lineWidth);
                        }
                    }
                    

                    canvas.lastmovex=canvas.lastmovex1;
                    canvas.lastmovey=canvas.lastmovey1;
                    canvas.lastmovex1=coor.x;
                    canvas.lastmovey1=coor.y;
                    canvas.lastmoveclientx=coor.clientX;
                    canvas.lastmoveclienty=coor.clientY;
                }
                 
            }
            
           
            //event.preventDefault();
            return;
        }
        if(this.mode==this.MODE_ENTER_TEXT){
            //do nothing
            canvas.lastmovex=coor.x;
            canvas.lastmovey=coor.y;
            canvas.lastmoveclientx=coor.clientX;
            canvas.lastmoveclienty=coor.clientY;
            event.preventDefault();
            return;
        }
        if(this.mode==this.MODE_EDIT_TEXT){
            //do nothing
            event.preventDefault();
            return;
        }


    
     },
     onCanvasTouchEnd:function(event){
        //alert("touch end");
        cc.log("touch end");
        var canvas=event.currentTarget;
        if(this.mode==this.MODE_NORMAL){
            this.onCanvasEnd(canvas);
            event.preventDefault();
            return;
        }
        if(this.mode==this.MODE_DRAWRING){
            this.onCanvasEnd(canvas);
           // var ctx=canvas.getContext("2d");
            event.preventDefault();
            return;
        }
        if(this.mode==this.MODE_ENTER_TEXT){
            this.onCanvasEnd(canvas);
            event.preventDefault();
            event.stopPropagation(); 
            return;
        }
        if(this.mode==this.MODE_EDIT_TEXT){
            this.onCanvasEnd(canvas);
            event.preventDefault();
            return;
        }
     },

     onCanvasEnd:function(canvas){
        var now=new Date().getTime();
        if(!canvas.downing) return;
        cc.log("onCanvasEnd "+canvas.lastmovex+":"+canvas.downx+":"+canvas.lastmovey+":"+canvas.downy+":"+this.mode+":"+this.currBrush);
        cc.log("onCanvasEnd "+canvas.lastmoveclientx+":"+canvas.downclientx+":"+canvas.lastmoveclienty+":"+canvas.downclienty+":"+this.mode+":"+this.currBrush);
        var needCheckTap=true;
        var currEndMode=this.mode;
        if(currEndMode==this.MODE_ENTER_TEXT){
           if(is_touch_device()){
               if(this.checkIsTouchTapCanvas(canvas)){
                    this.blurText();
                    this.setMode(this.MODE_DRAWRING);
                    this.setBrushDraw(this.BRUSH_MOVE);
               }
           }else{
                    this.blurText();
                    this.setMode(this.MODE_DRAWRING);
           } 
           needCheckTap=false;
        }
        if(currEndMode==this.MODE_DRAWRING){
            if(this.currBrush==this.BRUSH_TEXT){
                if(is_touch_device()){
                    if(this.checkIsTouchTapCanvas(canvas)){
                         this.addText(canvas.index,canvas.lastmovex,canvas.lastmovey);
                         
                    }
                }else{
                     this.addText(canvas.index,canvas.lastmovex,canvas.lastmovey);
                }
                needCheckTap=false;
            }
            if(this.currBrush==this.BRUSH_ERASE){
                //this.setBrushDraw(this.BRUSH_MOVE);
                needCheckTap=false;
            }
            if(this.currBrush==this.BRUSH_PEN){
                needCheckTap=false;
                canvas.setAttribute("hasDraw",true);  
            }
            var canvasDraw=document.getElementById("canvasDraw_"+canvas.pageid);
            var ctx=canvas.getContext("2d");
                var ctxDraw=canvasDraw.getContext("2d");        
                ctxDraw.clearRect(0,0,canvas.width,canvas.height);
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeMiterLimit=10;
                ctx.shadowColor = "rgba(0,0,0,.5)";
                ctx.globalAlpha=this.currDrawStyle.alpha;
                ctx.strokeStyle=this.currDrawStyle.strokeStyle;
                ctx.lineWidth=this.currDrawStyle.lineWidth;
                ctx.globalCompositeOperation="source-over";  


            if(this.currBrush==this.BRUSH_LINE){
                ctx.beginPath();  
                ctx.moveTo(canvas.downx,canvas.downy);
                ctx.lineTo(canvas.lastmovex1,canvas.lastmovey1);
                ctx.stroke();
                canvas.setAttribute("hasDraw",true);        
                needCheckTap=false;
            }
            if(this.currBrush==this.BRUSH_RECTANGLE){
                ctx.beginPath();  
                var minx=Math.min(canvas.downx,canvas.lastmovex1);
                var miny=Math.min(canvas.downy,canvas.lastmovey1);
                var maxx=Math.max(canvas.downx,canvas.lastmovex1);
                var maxy=Math.max(canvas.downy,canvas.lastmovey1);
                ctx.rect(minx,miny,maxx-minx,maxy-miny);
                ctx.stroke();
                canvas.setAttribute("hasDraw",true);        
                needCheckTap=false;
            }
            if(this.currBrush==this.BRUSH_CIRCLE){
                ctx.beginPath();  
                var radius=Math.floor(Math.sqrt((canvas.downx-canvas.lastmovex1)*(canvas.downx-canvas.lastmovex1)+(canvas.downy-canvas.lastmovey1)*(canvas.downy-canvas.lastmovey1)));
                ctx.arc(canvas.downx, canvas.downy,radius, 0, 2 * Math.PI);
                ctx.stroke();
                canvas.setAttribute("hasDraw",true);        
            }
            if(this.currBrush==this.BRUSH_ARROW){
                ctx.beginPath();  
                ctx.moveTo(canvas.downx,canvas.downy);
                ctx.lineTo(canvas.lastmovex1,canvas.lastmovey1);
                ctx.stroke();
                drawArrowhead(ctx,{x:canvas.downx,y:canvas.downy},{x:canvas.lastmovex1,y:canvas.lastmovey1},3*ctx.lineWidth);
                canvas.setAttribute("hasDraw",true);
            }

            $(".obj_text").css("pointer-events","all");
            $(".obj_static_text").css("pointer-events","all");
        }

        if(needCheckTap){
            //check isTap or not
            var isTap=false;
            if(!is_touch_device()) {
                //on mouse event
                isTap=true;
            }else{
                //on touch 
                if(now -canvas.downtime<150 && canvas.downy>0 && canvas.downx>0 && canvas.lastmovex>0 && canvas.lastmovey>0){
                    if(Math.abs(canvas.lastmoveclientx-canvas.downclientx)<13 && Math.abs(canvas.lastmoveclienty-canvas.downclienty)<13){
                        isTap=true;
                    }
                }
            }

            //check how many tap
            if(isTap){
                if(canvas.endtime!=undefined){
                    if(now-canvas.endtime<200){
                        canvas.tapCount++;
                        cc.log(canvas.tapCount+" multi click canvas "+canvas.index+":"+canvas.endx+":"+canvas.endy);
                        if(canvas.tapCount==2){
                            this.doubleClickCanvas(canvas);
                        }
                    }else{
                        canvas.tapCount=1;
                    }
                }else{
                    canvas.tapCount=1;
                }
            }else{
                canvas.tapCount=0;
            }

            if(canvas.tapCount==1){
                var canvas_check=canvas;
                setTimeout(()=>{
                    if(canvas_check.tapCount==1){
                        //fire event click canvas
                        this.clickCanvas(canvas_check);
                    }
                },200);
            }
        }
        
        canvas.endtime=now;
        canvas.endx=canvas.lastmovex;
        canvas.endy=canvas.lastmovey;
        canvas.endmovefar=canvas.movefar;

        canvas.downing=false;
        canvas.downx=-1;
        canvas.downy=-1;
        canvas.lastmovex=-1;
        canvas.lastmovey=-1;
        canvas.downtime=0;
        canvas.movefar=false;
        
     },
     checkIsTouchTapCanvas:function(canvas){
         var now=new Date().getTime();
        if(now -canvas.downtime<150 && canvas.downy>0 && canvas.downx>0 && canvas.lastmovex>0 && canvas.lastmovey>0){
            if(Math.abs(canvas.lastmoveclientx-canvas.downclientx)<13 && Math.abs(canvas.lastmoveclienty-canvas.downclienty)<13){
                    return true;
            }
        }

        return false;
     },

     clickCanvas:function(canvas){
        cc.log("click canvas "+canvas.index+":"+canvas.endx+":"+canvas.endy+":"+this.staticTextConfig.correctWidth/2);
        if(this.mode==this.MODE_NORMAL){
            this.addStaticText(canvas.index,"correct",canvas.endx-30,canvas.endy-this.staticTextConfig.correctHeight/2);
        }
        if(this.mode==this.MODE_DRAWRING){
            if(this.currBrush!=this.BRUSH_TEXT && !canvas.endmovefar){
                this.addStaticText(canvas.index,"correct",canvas.endx-30,canvas.endy-this.staticTextConfig.correctHeight/2);
            }
        }
        
     },
     doubleClickCanvas:function(canvas){
        cc.log("double click canvas "+canvas.index+":"+canvas.endx+":"+canvas.endy);
        if(this.mode==this.MODE_NORMAL){
            this.addStaticText(canvas.index,"wrong",canvas.endx-30,canvas.endy-this.staticTextConfig.wrongHeight/2);
        }
        if(this.mode==this.MODE_DRAWRING){
            if(this.currBrush!=this.BRUSH_TEXT && !canvas.endmovefar){
                this.addStaticText(canvas.index,"wrong",canvas.endx-30,canvas.endy-this.staticTextConfig.wrongHeight/2);
            }
        }    
     },

     getCoorTouchCanvas:function(dom,touch){
        var x=touch.clientX;
        var y=touch.clientY; 
        var boundingBox=dom.getBoundingClientRect();
        var posx=Math.floor((x-boundingBox.left)*($(dom).width()/boundingBox.width));
        var posy=Math.floor((y-boundingBox.top)*($(dom).height()/boundingBox.height));

        return {
            x:posx,
            y:posy
        }
     },
     getCoorTouchEvent:function(dom,event){
        if(event.touches){
            //touch screen
            if(event.touches.length<1) {
                return {
                    x:0,
                    y:0
                }
            }
            var touch =event.touches[event.touches.length-1];
            var x=touch.clientX;
            var y=touch.clientY; 
            var boundingBox=dom.getBoundingClientRect();
            var posx=Math.floor((x-boundingBox.left)*($(dom).width()/boundingBox.width));
            var posy=Math.floor((y-boundingBox.top)*($(dom).height()/boundingBox.height));
            return {
                clientX:x,
                clientY:y,
                x:posx,
                y:posy
            }
        }else{
            //mouse click
            var x=event.clientX;
            var y=event.clientY;
            var boundingBox=dom.getBoundingClientRect();
            var posx=Math.floor((x-boundingBox.left)*($(dom).width()/boundingBox.width));
            var posy=Math.floor((y-boundingBox.top)*($(dom).height()/boundingBox.height));
            return {
                clientX:x,
                clientY:y,
                x:posx,
                y:posy
            }
        }

     },
     getCoorTouch:function(e){
        var x,y;
        if(e.touches && e.touches.length==1){
            x=e.touches[e.touches.length-1].clientX;
            y=e.touches[e.touches.length-1].clientY;
        }else{
            x=e.clientX;
            y=e.clientY;
        }
        return {
            clientX:x,
            clientY:y,
            x:x,
            y:y
        }
     },

     showMenuNormal:function(){
        $("#mnote_hold_bt").css("display","flex");
        $("#mnote_setting_bt").css("display","block");
        $("#mnote_help").css("display","block");
        $(".help_text").css("display","block");
     },
     hideMenuNormal:function(){
        $("#mnote_hold_bt").css("display","none");
        $("#mnote_setting_bt").css("display","none");
        $(".help_text").css("display","none");
     },

     setMode:function(mode){
         if(mode==this.mode) return;
         
         this.hideMenuDraw();
         this.hideMenuText();  
         this.hideMenuNormal();

         if(mode==this.MODE_NORMAL){
            this.showMenuNormal();
            this.blurText();
            if(!is_touch_device()){
                $("#mnote_pages").css("cursor","default");
            }
         }
         if(mode==this.MODE_ENTER_TEXT){
            this.showMenuText();
         }
         if(mode==this.MODE_DRAWRING){
            this.showMenuDraw();
         }

         this.mode=mode;
     },

     enterDrawingMode:function(){
         this.isDrawingMode=true;
         this.mode=this.MODE_DRAWRING;
         //if(this.panzoom) this.panzoom.isDrawing=true;
         
         this.showMenuDraw();
         //this.setBrushDraw(this.BRUSH_PEN);
        // $("#mnote_hold_bt").find("span").css("display","none");
     },
     exitDrawingMode:function(){
         this.isDrawingMode=false;
         this.mode=this.MODE_NORMAL;
         $(".help_text").css("display","block");
         this.hideMenuDraw();
         $("#mnote_hold_bt").css("display","flex");   
         //if(this.panzoom) this.panzoom.isDrawing=false;
         
         //this.hideMenuColor();
         //hide menu drawing
     },
     showMenuDraw:function(){
        if(is_touch_device()){
            $("#mnote_menu_bottom").css("display","block");
        }else{
            var span=$("#mnote_menu_draw").find("span").first();
            $("#mnote_menu_draw").css("display","flex");
            //effect
            gsap.fromTo(".btn-menu-draw",{scale:1},{scale:1, duration: 0.1,ease: "expo.out"});
            if(this.currBrush==this.BRUSH_MOVE){
                this.setBrushDraw(this.BRUSH_PEN);    
            }
        }
        if(this.currBrush==this.BRUSH_TEXT){
            this.setBrushDraw(this.BRUSH_MOVE);
        }
     },
     hideMenuDraw:function(){
        if(is_touch_device()){
            $("#mnote_menu_bottom").css("display","none");
        }else{
            clearInterval(this.ivtInvisibleSpanMenuDraw);
            $("#mnote_menu_draw").css("display","none");
        }
        
        //effect
     },
     setBrushDraw:function(brush){
        this.currBrush=brush;
        if(!is_touch_device()){
            if(brush==this.BRUSH_PEN
               || brush==this.BRUSH_LINE
               || brush==this.BRUSH_RECTANGLE
               || brush==this.BRUSH_CIRCLE
               || brush==this.BRUSH_ARROW
               ){
                $("#mnote_pages").css("cursor","url('images/pen.png') 0 20, auto");
            }else if(brush==this.BRUSH_ERASE){
                $("#mnote_pages").css("cursor","url('images/erase.png') 0 20, auto");
            }else if(brush==this.BRUSH_TEXT){
                $("#mnote_pages").css("cursor","url('images/text.png') 0 20, auto");
            }else{
                $("#mnote_pages").css("cursor","default");
            }
        }
        
        this.setDrawStyle(this.currDrawStyle);
     
     },
     showMenuColor:function(){
        $(this.mnote_menu_color).css("display","block");
        gsap.fromTo(this.menu_color_content,{scale:0.1},{scale:1, duration: 0.15,ease: "expo.out"});
     },
     hideMenuColor:function(){
        $(this.mnote_menu_color).css("display","none");
     },
     setDrawStyle:function(style){
        var lastStrokeStyle=this.currDrawStyle.strokeStyle;

        cc.log("setDrawStyle "+JSON.stringify(style));

        if(style.lineWidth) this.currDrawStyle.lineWidth=style.lineWidth;
        if(style.strokeStyle) this.currDrawStyle.strokeStyle=style.strokeStyle;
        if(style.alpha) this.currDrawStyle.alpha=style.alpha;

        cc.log("setDrawStyle "+JSON.stringify(this.currDrawStyle)+":"+this.currBrush);
        //bind ui menu color

        $("#btn_thick_preview").css("opacity",this.currDrawStyle.alpha);

        var self=this;
        $(".btn-content-color").each(function(e){
            $(this).empty();
            var color=$(this).attr("data");
            if(color==self.currDrawStyle.strokeStyle){
                $(this).append($('<i class="material-icons">check</i>'))   
            }
        })

        $("#btn_draw_color").find("svg").css("fill",this.currDrawStyle.strokeStyle);
        $("#btn_thick_preview").css("background-color",this.currDrawStyle.strokeStyle);

        $(this.thickSliderInput).val(this.currDrawStyle.lineWidth);
        $("#btn_thick_preview").css("width",(this.currDrawStyle.lineWidth+5)+"px");
        $("#btn_thick_preview").css("height",(this.currDrawStyle.lineWidth+5)+"px");


        this.setActiveButton(this.btnDrawPen,false);
        this.setActiveButton(this.btnDrawErase,false);
        this.setActiveButton(this.btnDrawText,false);
        this.setActiveButton(this.btnDrawMove,false);
        this.setActiveButton(this.contentBushPen,false);
        this.setActiveButton(this.contentBushLine,false);
        this.setActiveButton(this.contentBushRect,false);
        this.setActiveButton(this.contentBushCircle,false);
        this.setActiveButton(this.contentBushArrow,false);


        $(".btn-option-draw").css("background-color","black");
        $(".btn-option-draw").find("svg").css("fill","#888888");
        $(".btn-option-draw").find("svg").css("color","#888888");
        $(".btn-option-draw").find("i").css("color","#888888");
        $("#option_brush").css("display","none");

        if(this.currBrush==this.BRUSH_PEN){
            this.setActiveButton(this.btnDrawPen,true,this.currDrawStyle.strokeStyle);
            this.setActiveButton(this.contentBushPen,true,this.currDrawStyle.strokeStyle);
            $("#btn_option_pen").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_pen").find("svg").css("fill","white");
            $("#btn_option_pen").find("i").css("color","white");
            $("#option_brush").css("display","block");
            $("#btn_option_brush_pen").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_brush_pen").find("svg").css("fill","white");
            $("#btn_option_brush_pen").find("svg").css("color","white");
            $("#btn_option_brush_pen").find("i").css("color","white");
        }
        if(this.currBrush==this.BRUSH_LINE){
            this.setActiveButton(this.btnDrawPen,true,this.currDrawStyle.strokeStyle);
            this.setActiveButton(this.contentBushLine,true,this.currDrawStyle.strokeStyle);
            $("#btn_option_pen").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_pen").find("svg").css("fill","white");
            $("#btn_option_pen").find("i").css("color","white");
            $("#option_brush").css("display","block");

            $("#btn_option_brush_line").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_brush_line").find("svg").css("fill","white");
            $("#btn_option_brush_line").find("svg").css("color","white");
            $("#btn_option_brush_line").find("i").css("color","white");
        }
        if(this.currBrush==this.BRUSH_RECTANGLE){
            this.setActiveButton(this.btnDrawPen,true,this.currDrawStyle.strokeStyle);
            this.setActiveButton(this.contentBushRect,true,this.currDrawStyle.strokeStyle);
            $("#btn_option_pen").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_pen").find("svg").css("fill","white");
            $("#btn_option_pen").find("i").css("color","white");
            $("#option_brush").css("display","block");
            $("#btn_option_brush_rect").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_brush_rect").find("svg").css("fill","white");
            $("#btn_option_brush_rect").find("svg").css("color","white");
            $("#btn_option_brush_rect").find("i").css("color","white");
        }
        if(this.currBrush==this.BRUSH_CIRCLE){
            this.setActiveButton(this.btnDrawPen,true,this.currDrawStyle.strokeStyle);
            this.setActiveButton(this.contentBushCircle,true,this.currDrawStyle.strokeStyle);
            $("#btn_option_pen").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_pen").find("svg").css("fill","white");
            $("#btn_option_pen").find("i").css("color","white");
            $("#option_brush").css("display","block");
            $("#btn_option_brush_circle").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_brush_circle").find("svg").css("fill","white");
            $("#btn_option_brush_circle").find("svg").css("color","white");
            $("#btn_option_brush_circle").find("i").css("color","white");
        }
        if(this.currBrush==this.BRUSH_ARROW){
            this.setActiveButton(this.btnDrawPen,true,this.currDrawStyle.strokeStyle);
            this.setActiveButton(this.contentBushArrow,true,this.currDrawStyle.strokeStyle);
            $("#btn_option_pen").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_pen").find("svg").css("fill","white");
            $("#btn_option_pen").find("i").css("color","white");
            $("#option_brush").css("display","block");
            $("#btn_option_brush_arrow").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_brush_arrow").find("svg").css("fill","white");
            $("#btn_option_brush_arrow").find("svg").css("color","white");
            $("#btn_option_brush_arrow").find("i").css("color","white");
        }
        if(this.currBrush==this.BRUSH_ERASE){
            this.setActiveButton(this.btnDrawErase,true,this.currDrawStyle.strokeStyle);
            $("#btn_option_erase").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_erase").find("svg").css("fill","white");
            $("#btn_option_erase").find("i").css("color","white");
        }
        if(this.currBrush==this.BRUSH_TEXT){
            this.setActiveButton(this.btnDrawText,true,this.currDrawStyle.strokeStyle);
            $("#btn_option_text").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_text").find("svg").css("fill","white");
            $("#btn_option_text").find("i").css("color","white");
        }
        if(this.currBrush==this.BRUSH_MOVE){
            this.setActiveButton(this.btnDrawMove,true,this.currDrawStyle.strokeStyle);
            $("#btn_option_move").css('background-color',this.currDrawStyle.strokeStyle);
            $("#btn_option_move").find("svg").css("fill","white");
            $("#btn_option_move").find("i").css("color","white");
        }

        $("#thick_slider").find(".thumb").css("display","block");
        $("#thick_slider").find(".thumb").css("opacity",0.7);
        $("#thick_slider").find(".thumb").css("background-color",this.currDrawStyle.strokeStyle);

        $("#color_preview").css("background-color",this.currDrawStyle.strokeStyle);
        $("#color_preview").css("opacity",this.currDrawStyle.alpha);
        $("#color_preview").css("width",(this.currDrawStyle.lineWidth+5)+"px");
        $("#color_preview").css("height",(this.currDrawStyle.lineWidth+5)+"px");

        $("#btn_hold_draw").css("background-color",this.currDrawStyle.strokeStyle);
        $("#mnote_hold_bt").find("span").css("color",this.currDrawStyle.strokeStyle);
        $(this.btnDrawFinish).css("color",this.currDrawStyle.strokeStyle);

        var size=this.currDrawStyle.lineWidth;
        var posx=this.canvas_slider.width*(size-this.minLineWidth)/this.maxLineWidth;

        $("#preview_draw_bt").css("width",(3+size)+"px");
        $("#preview_draw_bt").css("height",(3+size)+"px");
        $("#preview_draw_bt").css("background-color",this.currDrawStyle.strokeStyle);

        var self=this;
        $(".btn-color-bottom-small").each(function(e){
            $(this).empty();
            $(this).parent().css("border","none");
            var color=$(this).attr("data");
            if(color==self.currDrawStyle.strokeStyle){
                $(this).append($('<i class="material-icons">check</i>'))   
                $(this).parent().css("border","solid 1px #CCCCCC");
            }
        })


        try{
            if(localStorage){
                localStorage.setItem("drawStyle",JSON.stringify(this.currDrawStyle));
            }
        }catch(e){

        }

     },

     setActiveButton:function(bt,isActive,color){
        if(isActive){
            $(bt).removeClass($(bt).attr("activeColor"));
            $(bt).addClass(color);
            $(bt).find("svg").css("fill","white");
            $(bt).find("svg").css("color","white");
            $(bt).find("i").css("color","white");
            $(bt).attr("activeColor",color);
        }else{
            $(bt).removeClass($(bt).attr("activeColor"));
            $(bt).addClass("white");
            $(bt).find("svg").css("fill","#666666");
            $(bt).find("svg").css("color","#666666");
            $(bt).find("i").css("color","#666666");
            $(bt).attr("activeColor","white");
        }
     },

     lastXStaticTextAdded:-1,
     lastYStaticTextAdded:-1,
     addStaticText:function(pageId,value,x,y){
        //check position valid
        
        var maxheight=document.getElementById("canvas_"+pageId).height;
        var maxwidth=document.getElementById("canvas_"+pageId).width;
        //console.log("add static text "+pageId+":"+value+":"+x+":"+y+":"+maxheight+":"+maxwidth);
        x=Math.abs(x);
        y=Math.abs(y);
        if(x<0 || y<0 || x>maxwidth-40 || y>maxheight-40){
            return;
        }
        if(Math.abs(x-this.lastXStaticTextAdded)<2 && Math.abs(y-this.lastYStaticTextAdded)<2){
            return ;
        }
        
        //console.log("add static text "+pageId+":"+value+":"+x+":"+y+":"+JSON.stringify(this.staticTextConfig));

        var textValue="";
        if(value.toLowerCase()=="wrong"){
            if(this.staticTextConfig.useWrongText) textValue=this.staticTextConfig.textWrong;
        }else{
            if(this.staticTextConfig.useCorrectText) textValue=this.staticTextConfig.textCorrect;
        }
        var divText=$("<span pageid="+pageId+" class=\"obj_static_text\"><span>"+textValue+"</span></span>");
        var divObjsLayer=$("#page_"+pageId).find(".page_objs_layer")[0];
        $(divObjsLayer).append(divText);
        $(divText).css("position","absolute");
        $(divText).attr("pageid",pageId);
        $(divText).css("font-family",this.staticTextConfig.fontText);
        $(divText).css("font-size",this.staticTextConfig.fontSize+"px");
        $(divText).css("text-align","center");
        $(divText).css("font-weight","bold");
        $(divText).css("min-width","50px");
        $(divText).css("min-height","50px");
        $(divText).css("text-shadow","1px 1px 1px #827e7e")
       
        $(divText).css("left",Math.floor(x)+"px");
        $(divText).css("top",Math.floor(y)+"px");
        this.lastXStaticTextAdded=x;
        this.lastYStaticTextAdded=y;
        var color ;
        if(value.toLowerCase()=="wrong"){
            this.countWrong++;
            $(divText).addClass("wrong");
            color=this.staticTextConfig.fontColor;
            var imgw=$('<img class="wrong_img" src="'+this.staticTextConfig.urlImgWrong+'" width="30" height="30"/>');
            $(divText).append($(imgw));
            if(this.staticTextConfig.useWrongText){
                $(imgw).css("display","none");
                $(divText).find("span").css("display",'block');
            }else{
                $(imgw).css("display","block");
                $(divText).find("span").css("display",'none');
            }
        }else{
            this.countRight++;
            $(divText).addClass("correct");
            color=this.staticTextConfig.fontColor;
            var imgr=$('<img class="correct_img" src="'+this.staticTextConfig.urlImgCorrect+'" width="30" height="30" />');
            $(divText).append($(imgr));
            if(this.staticTextConfig.useCorrectText){
                $(imgr).css("display","none");
                $(divText).find("span").css("display",'block');
            }else{
                $(imgr).css("display","block");
                $(divText).find("span").css("display",'none');
            }
        }
        this.updateMark();
        $(divText).css("color",color);
        if(this.mnotedata.mode=="edit") $(divText).css("pointer-events","all");
        this.moveable(divText);

     },

     moveable:function(dom){
        if(this.mnotedata.mode!="edit") return;
        var self=this;
        $(dom).on("touchstart mousedown",function(e){
            //console.log("on touch start obj");
            if(e.touches && e.touches.length>1) return;
            var touchPos=self.getCoorTouch(e);
            $(this).attr("downx",Math.floor(touchPos.x));
            $(this).attr("downy",Math.floor(touchPos.y));
            $(this).attr("clientx",Math.floor(touchPos.clientX));
            $(this).attr("clienty",Math.floor(touchPos.clientY));
            $(this).attr("lastx",Math.floor(touchPos.x));
            $(this).attr("lasty",Math.floor(touchPos.y));
            $(this).attr("downtime",new Date().getTime());
            $(".obj_down").removeClass("obj_down");
            $(this).addClass("obj_down");

            if(self.mode!=self.MODE_ENTER_TEXT){
                $("#bt_trash").css("display","block");
                $("#bt_trash").css("opacity",0.7);
            }
            
            if($(dom).hasClass("obj_static_text")){
                e.preventDefault();
                e.stopPropagation();
                self.setObjsActive(this);
            }
        })
        
        $(dom).on("touchmove",function(e){
           // if(self.isDrawingMode) return;
           
           if(e.touches && e.touches.length>1) return;
           var touchPos=self.getCoorTouch(e);
           self._moveObj(e.currentTarget,e); 

            e.preventDefault();
            e.stopPropagation();
        })
        $(dom).on("touchend mouseup",function(e){
            //console.log("on touch end obj");
            self._endObj(this,e);
            e.preventDefault();
            e.stopPropagation();
            
        })
     },

     _moveObj:function(dom,e){
        if($(dom).hasClass("obj_down").toString()=="true"){
            var touchPos=this.getCoorTouch(e);
            var downx=parseInt($(dom).attr("downx"));
            var downy=parseInt($(dom).attr("downy"));
            if(Math.abs(touchPos.x-downx)>5 || Math.abs(touchPos.y-downy)>5){
                var coor=this.getCoorTouchEvent(dom.parentNode,e);
                $(dom).css("left",Math.floor(coor.x-$(dom).width()/2)+"px");
                $(dom).css("top",Math.floor(coor.y-$(dom).height()/2)+"px");
            }
            $(dom).attr("lastx",touchPos.x);
            $(dom).attr("lasty",touchPos.y);


           if(Math.abs(touchPos.clientX-downx)>10 || Math.abs(touchPos.clientY-downy)>10){
                $(dom).attr("movefar",true);        
           } 

           $(dom).attr("clientx",Math.floor(touchPos.clientX));
           $(dom).attr("clienty",Math.floor(touchPos.clientY));

           var clientx=parseInt($(dom).attr("clientx"));
           var clienty=parseInt($(dom).attr("clienty"));
           if(clientx>self.appWidth/2-30 && clientx<self.appWidth/2+30 && clienty<70){
                $("#bt_trash").css("opacity",1);
            }else{
                $("#bt_trash").css("opacity",0.7);
            }
        }
     },

     _endObj:function(dom,e){
        //console.log("on touch end obj");
        var self=this;
        if($(dom).hasClass("obj_down").toString()=="true"){
            //check tap 
            var downx=parseInt($(dom).attr("downx"));
            var downy=parseInt($(dom).attr("downy"));
            var lastx=parseInt($(dom).attr("lastx"));
            var lasty=parseInt($(dom).attr("lasty"));
            var clientx=parseInt($(dom).attr("clientx"));
            var clienty=parseInt($(dom).attr("clienty"));

            var movefar=$(dom).attr("movefar");
            //console.log("end move far "+movefar);
            if(movefar!="true"){
                //tap
                if($(dom).hasClass("obj_text")){
                    if(!$(dom).hasClass("focusing")){
                        self.focusText(dom);
                       // self.setMode(self.MODE_ENTER_TEXT);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
                if($(dom).hasClass("obj_static_text")){
                    //if right -> wrong 
                    //console.log("on touch end obj right -wrong");
                    if($(dom).hasClass("correct")){
                        $(dom).removeClass("correct");
                        $(dom).addClass("wrong");
                        $(dom).find("span").html(self.staticTextConfig.textWrong);
                        var img =$(dom).find("img");
                        if(img.length>0) {
                            $(img[0]).attr("src",self.staticTextConfig.urlImgWrong);
                            $(img[0]).removeClass("correct_img");
                            $(img[0]).addClass("wrong_img");
                        }
                        if(self.staticTextConfig.useWrongText){
                            $(dom).find("span").css("display","block") ;
                            $(dom).find("img").css("display","none") ;
                        }else{
                            $(dom).find("span").css("display","none") ;
                            $(dom).find("img").css("display","block") ;
                        }
                        
                        self.countRight--;
                        self.countWrong++;
                        self.updateMark();
                    }
                }
            }

            $(dom).attr("movefar",false);

            $("#bt_trash").css("display","none");
            cc.log("pos up "+clientx+":"+clienty+":"+self.appWidth+":"+self.appHeight/2+":"+lasty);
            if(is_touch_device()){
                if(clientx>self.appWidth/2-30 && clientx<self.appWidth/2+30 && clienty<70){
                    $(dom).remove();
                    self.updateMark();
                    e.preventDefault();
                    e.stopPropagation();
                    return
                }
            }else{
                if(clientx>0 && clientx<80 &&  clienty<self.appHeight/2+30 && clienty>self.appHeight/2-30){
                    $(dom).remove();
                    self.updateMark();
                    e.preventDefault();
                    e.stopPropagation();
                    return
                }
            }
            

            var posx=parseInt($(dom).css("left"));
            var posy=parseInt($(dom).css("top"));
            var maxheight=document.getElementById("canvas_"+parseInt($(dom).attr("pageid"))).height;
            if(posx<0 || posy<0 || posx>self.pageWidth-40 || posy>maxheight-40){
                $(dom).remove();
                self.updateMark();
                e.preventDefault();
                e.stopPropagation();
            }
        
        var lastTouchTime=parseInt($(dom).attr("lastTouchTime"));

            if($(dom).hasClass("obj_static_text")){
                //check double tap 
                var now=new Date().getTime();
                if(!isNaN(lastTouchTime)){
                    var timecheck=(is_touch_device())? 300:700;
                    if(now-lastTouchTime<timecheck){
                        //var str=$(dom).attr("value");
                        if($(dom).hasClass("wrong")){
                            self.countWrong--;
                        }else{
                            self.countRight--;
                        }
                        $(dom).remove();
                        self.updateMark();
                        e.preventDefault();
                        e.stopPropagation();
                        return ;
                    }
                }
                self.inactiveAllObj();
            }

            $(dom).attr('lastTouchTime',now);
            $(".obj_down").removeClass("obj_down");
            
        }
     },

     setObjsActive:function(obj){
        this.inactiveAllObj();
        $(obj).addClass("obj_active");
        $(obj).css("border","2px dashed");
     },
     inactiveAllObj:function(){
        $(".obj_active").css("border","none"); 
        $(".obj_active").removeClass("obj_active");
     },


    /**** menu bottom */
     initMenuBottom:function(){
        var arrColor=["green","red","purple","#3f51b5","teal","#03a9f4","yellow","#cddc39","cyan","#ffc107","#795548","#424242"];

        $("#menu_bottom_2_content").empty();
        for(var i=0;i<arrColor.length;i++){
            var child=$('<div class="btn-color-bottom"><div data="'+arrColor[i]+'" class="btn-color-bottom-small  btn-small btn-floating btn-flat waves-effect waves-light" style="background-color:'+arrColor[i]+'"></div></div>');
            $("#menu_bottom_2_content").append($(child));
        }

        var self=this;
        $(".btn-color-bottom-small").click(function(e){
           /* $(".btn-color-bottom").css("border","none");
            $(this).css("border","solid 1px #CCCCCC");*/
            self.setDrawStyle({strokeStyle:$(this).attr("data")});
        })

        this.canvas_slider=document.getElementById("canvas_slider");
    
        this.createCanvasSlider($("#menu_bottom_slider"),"#888888",this.minLineWidth,this.maxLineWidth,this.currDrawStyle.lineWidth);

        $(".btn-option-draw").click(function(e){
            var data=$(this).attr('data');
            if(data=="pen"){
                self.setBrushDraw(self.BRUSH_PEN);
            }
            if(data=="erase"){
                self.setBrushDraw(self.BRUSH_ERASE);
            }
            if(data=="move"){
                self.setBrushDraw(self.BRUSH_MOVE);
            }
            if(data=="text"){
                self.setBrushDraw(self.BRUSH_TEXT);
            }
            if(data=="line"){
                self.setBrushDraw(self.BRUSH_LINE);
            }
            if(data=="rect"){
                self.setBrushDraw(self.BRUSH_RECTANGLE);
            }
            if(data=="circle"){
                self.setBrushDraw(self.BRUSH_CIRCLE);
            }
            if(data=="arrow"){
                self.setBrushDraw(self.BRUSH_ARROW);
            }

            
        })
        
        $("#menu_bottom_close").on("touchstart mouseup",(e)=>{
            self.setMode(self.MODE_NORMAL);
            e.stopPropagation();
            e.preventDefault();
        })
        $("#mnote_menu_bottom").on("touchstart",(e)=>{
           // e.stopPropagation();
           // e.preventDefault();
        })
     },

     createCanvasSlider:function(slider,colorBg,min,max,value){
        var canvass=$(slider).find("canvas");
        if(canvass.length<1) return;
        var canvas=canvass[0];
        var thumbs=$(slider).find(".thumb");
        if(thumbs.length<1) return;
        var thumb=thumbs[0];
        
        var ctx=canvas.getContext("2d");
        ctx.strokeStyle=colorBg;
        ctx.lineWidth=4;
        canvas.min=min;
        canvas.max=max;
        ctx.fillStyle=colorBg;
        ctx.moveTo(4,canvas_slider.height/2);
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.strokeMiterLimit=2;
        ctx.lineTo(canvas.width,Math.floor(canvas.height/2-5));
        ctx.lineTo(canvas.width,Math.floor(canvas.height/2+5));
        ctx.lineTo(4,canvas.height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        this.setCanvasSliderValue(slider,value);

        if(is_touch_device()){
            canvas.addEventListener("touchstart",(e)=>{
                //console.log("on canvas touchstart");
                this._updateThumbSlider(slider,e);
                e.stopPropagation();
                e.preventDefault();
            })
            canvas.addEventListener("touchmove",(e)=>{
                this._updateThumbSlider(slider,e);
               // e.stopPropagation();
               // e.preventDefault();
            })
            $(thumb).on("touchstart",(e)=>{
                this._updateThumbSlider(slider,e);
                e.stopPropagation();
                e.preventDefault();
            })
            $(thumb).on("touchmove",(e)=>{
                this._updateThumbSlider(slider,e);
                e.stopPropagation();
                e.preventDefault();
            })
        }else{
            canvas.addEventListener("mousedown",(e)=>{
                //console.log("on canvas touchstart");
                canvas.isMouseDown=true;
                this._updateThumbSlider(slider,e);
                e.stopPropagation();
                e.preventDefault();
            })
            canvas.addEventListener("mousemove",(e)=>{
                if(canvas.isMouseDown==true){
                    this._updateThumbSlider(slider,e);
                }
               // e.stopPropagation();
               // e.preventDefault();
            })
            canvas.addEventListener("mouseup",(e)=>{
                canvas.isMouseDown=false;
                $(thumb).attr('mousedown',"false");
            })
            $(thumb).css('pointer-events',"none");

        }
        
     },

     setCanvasSliderValue:function(slider,value){
        var canvass=$(slider).find("canvas");
        if(canvass.length<1) return;
        var canvas=canvass[0];
        var thumbs=$(slider).find(".thumb");
        if(thumbs.length<1) return;
        var thumb=thumbs[0];

        if(value>canvas.max) value=max;
        if(value<canvas.min) value=min;
        ////console.log("update "+value);

        var per=(value-canvas.min)/(canvas.max-canvas.min);
        var thumbsize=3+per*20;
       // //console.log("update "+value+":"+per+":"+thumbsize);
        $(thumb).css("width",thumbsize+"px");
        $(thumb).css("height",thumbsize+"px");
        $(thumb).css("top",Math.floor(canvas.height-thumbsize)/2+"px");
        $(thumb).css("left",(Math.floor(canvas.width*per)-thumbsize/2)+"px");
        canvas.value=value;

        if(canvas==this.canvas_slider) this.setDrawStyle({lineWidth:value});
        if(canvas==this.slider_text_size) this.setTextStyle({size:value});


     },
     _updateThumbSlider:function(slider,e){
        // var canvas=e.currentTarget;
        var canvass=$(slider).find("canvas");
        if(canvass.length<1) return;
        var canvas=canvass[0];
        var touch;
        if(is_touch_device()){
            touch=e.touches[0];
        }else{
            touch={
                clientX:e.clientX,
            }
        }
        
        if(touch){
            var boundingBox=canvas.getBoundingClientRect();
            var posx=touch.clientX-boundingBox.left;
            if(posx<0) posx=0;
            if(posx>canvas.width) posx=canvas.width;
            var value=Math.floor(canvas.min+(canvas.max-canvas.min)*posx/canvas.width);
            
            this.setCanvasSliderValue(slider,value);
        }
     },
    /**** menu bottom */


    /*** add text  */
    initMenuText:function(){
        var arrColor=["green","red","purple","#3f51b5","teal","#03a9f4","yellow","#cddc39","cyan","#ffc107","#795548","#424242"];
        $("#menu_text_color_content").empty();
        for(var i=0;i<arrColor.length;i++){
            var child=$('<div class="btn-color-text"><div data="'+arrColor[i]+'" class="btn-color-text-small  btn-small btn-floating btn-flat waves-effect waves-light" style="background-color:'+arrColor[i]+'"></div></div>');
            $("#menu_text_color_content").append($(child));
        }

        this.slider_text_size=document.getElementById("slider_text_size");
        this.createCanvasSlider("#menu_text_slider","black",this.minTextSize,this.maxTextSize,this.currTextStyle.size);
        var self=this;
        
        if(is_touch_device()){
            $(".btn-color-text-small").on("touchstart",function(e){
                if(e.touches.length>1) return;
                 $(this).attr("downx",e.touches[0].clientX);   
                 $(this).attr("downy",e.touches[0].clientY);
                 $(this).attr("movex",e.touches[0].clientX);   
                 $(this).attr("movey",e.touches[0].clientY);      
            });
            $(".btn-color-text-small").on("touchmove",function(e){
                if(e.touches.length>1) return;
                $(this).attr("movex",e.touches[0].clientX);   
                $(this).attr("movey",e.touches[0].clientY);  
            });
            $(".btn-color-text-small").on("touchend",function(e){
                var downx=parseInt($(this).attr("downx"));
                var downy=parseInt($(this).attr("downy"));
                var movex=parseInt($(this).attr("movex"));
                var movey=parseInt($(this).attr("movey"));
                if(Math.abs(downx-movex)<13 && Math.abs(downy-movey)<13){
                    //console.log("set text color "+$(this).attr("data"));
                    self.setTextStyle({
                        color:$(this).attr("data")
                    })
                }
                
                e.stopPropagation();
                e.preventDefault();
            })
            
            $("#btn_option_align").on("touchend",function(e){
                //console.log("on align touch");
                if(self.currTextStyle.align=="left"){
                    self.setTextStyle({align:"center"});
                    return;
                }
                if(self.currTextStyle.align=="center"){
                    self.setTextStyle({align:"right"});
                    return;
                }
                if(self.currTextStyle.align=="right"){
                    self.setTextStyle({align:"left"});
                    return;
                }
                e.stopPropagation();
                e.preventDefault();
               
            })
    
            $("#btn_option_fill").on("touchend",function(e){
                //console.log("on fill touch "+self.currTextStyle.fill);
                if(self.currTextStyle.fill){
                    self.setTextStyle({fill:false});               
                }else{
                    self.setTextStyle({fill:true});                
                }
                e.stopPropagation();
                e.preventDefault();
            })

            $("#btn_option_font").on("touchend",function(e){
                if(isDomVisile(document.getElementById("menu_text_font"))){
                    $("#menu_text_font").css("display","none");
                }else{
                    $("#menu_text_font").css("display","block");
                }
                e.stopPropagation();
                e.preventDefault();
            })

            $(".font_chu").on("touchstart",function(e){
                self.setTextStyle({font:$(this).attr("data")});
                e.stopPropagation();
                e.preventDefault();
            })
    
            $("#menu_text_option").on("touchstart mousedown",(e)=>{
               // e.stopPropagation();
                e.preventDefault();
            })
            $("#mnote_menu_text").on("touchend mouseup",(e)=>{
                e.stopPropagation();
                e.preventDefault();
            })
    
            $("#menu_text_close").on("touchend",(e)=>{
                self.blurText();
                self.setMode(self.MODE_DRAWRING);
                e.stopPropagation();
                e.preventDefault();
            })
    
            $("#btn_text_size").on("touchend",(e)=>{
                if(isDomVisile(document.getElementById("menu_text_slider"))){
                    $("#menu_text_slider").css("display","none");
                }else{
                    $("#menu_text_slider").css("display","flex");
                }
                e.stopPropagation();
                e.preventDefault();
            })
    
            $("#menu_text_color").on("touchstart",(e)=>{
                e.stopPropagation();
               // e.preventDefault();
            })
        }else{
            $(".btn-color-text-small").on("mousedown",function(e){
                    self.setTextStyle({
                        color:$(this).attr("data")
                    })
                e.stopPropagation();
                e.preventDefault();
            })

            $("#btn_option_align").on("mousedown",function(e){
                //console.log("on align touch");
                e.stopPropagation();
                e.preventDefault();
                if(self.currTextStyle.align=="left"){
                    self.setTextStyle({align:"center"});
                    return;
                }
                if(self.currTextStyle.align=="center"){
                    self.setTextStyle({align:"right"});
                    return;
                }
                if(self.currTextStyle.align=="right"){
                    self.setTextStyle({align:"left"});
                    return;
                }
                
               
            })

            $("#btn_option_fill").on("mousedown",function(e){
                //console.log("on fill touch "+self.currTextStyle.fill);
                if(self.currTextStyle.fill){
                    self.setTextStyle({fill:false});               
                }else{
                    self.setTextStyle({fill:true});                
                }
                e.stopPropagation();
                e.preventDefault();
            })


            $("#btn_text_size").on("mousedown",(e)=>{
                if(isDomVisile(document.getElementById("menu_text_slider"))){
                    $("#menu_text_slider").css("display","none");
                }else{
                    $("#menu_text_slider").css("display","flex");
                }
                e.stopPropagation();
                e.preventDefault();
            })

            $("#btn_option_font").on("mousedown",function(e){
                if(isDomVisile(document.getElementById("menu_text_font"))){
                    $("#menu_text_font").css("display","none");
                }else{
                    $("#menu_text_font").css("display","block");
                }
                e.stopPropagation();
                e.preventDefault();
            })
            $(".font_chu").on("mousedown",function(e){
                self.setTextStyle({font:$(this).attr("data")});
                e.stopPropagation();
                e.preventDefault();
            })
            $("#menu_text_color").on("mousedown",(e)=>{
                e.stopPropagation();
               // e.preventDefault();
            })

            $("#menu_text_color").css("overflow-x","hidden");
        }
        

    },
    showMenuText:function(){
        $("#mnote_menu_text").css("display","block");
        $("#mnote_setting_zoom_out").css("display","none");
        $("#mnote_setting_zoom_in").css("display","none");
    },
    hideMenuText:function(){
        $("#mnote_menu_text").css("display","none");
        $('#menu_text_slider').css("display","none");
        $("#menu_text_font").css("display","none");
        if(!is_touch_device()){
            $("#mnote_setting_zoom_out").css("display","block");
            $("#mnote_setting_zoom_in").css("display","block");
        }
    },
    _addText:function(pageId,text,x,y,style){
        var minWidth=(is_touch_device())? 200:80;
        
        x=(x+minWidth>this.pageWidth)? this.pageWidth-minWidth:x;
        var divedit=$('<div pageid="'+pageId+'" class="obj_text" style="padding:10px" contenteditable="true">'+text+'</div>');
        var divObjsLayer=$("#page_"+pageId).find(".page_objs_layer")[0];
        $(divObjsLayer).append(divedit);
        $(divedit).css("position","absolute");
        $(divedit).css("font-family",style.font);
        $(divedit).css("text-align",style.align);
        $(divedit).css("left",x+"px");
        $(divedit).css("top",y+"px");
        $(divedit).css("min-width",minWidth+"px");
        $(divedit).css("letter-spacing","3px");
        $(divedit).css("font-size",(style.size)+"px");
        $(divedit).css("font-weight","bold");
        if(!style.fill){
            $(divedit).css("color",style.color);
            $(divedit).css("background-color","tranparent");
        }else{
            $(divedit).css("color","white");
            $(divedit).css("background-color",style.color);
        }
        
        if(this.mnotedata.mode=="edit") $(divedit).css("pointer-events","all");
        $(divedit).css("border-radius","8px");
        $(divedit).attr("styleText",JSON.stringify(style).replaceAll("\"","'"));

        //calculate moveup min max text
        var self=this;
        $(divedit).blur(function(){
            cc.log("on text lost focus");
            $(this).removeClass("focusing");
            $(this).css("border","none");
            if($(this).html().trim()==""){
                $(this).remove();
            }
            self.setMode(self.MODE_DRAWRING)
        });
        $(divedit).focus(function(e){
            cc.log("on text focus");
            $(this).addClass("focusing");
            $(this).css("border","dashed 2px");
            self.setTextStyle(JSON.parse($(this).attr("styleText").replaceAll("'","\"")));
            self.setMode(self.MODE_ENTER_TEXT);
        });
       // $(divedit).addClass("focusing");
       //this.focusText(divedit);
       
        $(divedit).on("input",function(e){
            var x=parseInt($(this).css('left'));
            if(x+$(this).width()>self.pageWidth-15){
                x=self.pageWidth-$(this).width()-15;
                $(this).css("left",x+"px");
            }
        })

        this.moveable(divedit);

        return $(divedit);
    },
    addText:function(pageId,x,y){
        
       var divedit=this._addText(pageId,"",x,y,this.currTextStyle);
       this.focusText($(divedit));
       
        this.setMode(this.MODE_ENTER_TEXT);

    },
    focusText:function(dom){
        this.blurText();
        $(".focusing").removeClass("focusing");
        $(dom).focus();

       // if(this.mode!=this.MODE_ENTER_TEXT){
            var diveditdom=$(dom).get(0);
            var boundingBox=diveditdom.getBoundingClientRect();
            var delta=0;
            if(boundingBox.top>this.appHeight/4-50){
                delta=boundingBox.top-(this.appHeight/4-50);
            }
            if(this.panzoom){
                if(getOs()=="android"){
                    this.panzoom.moveBy(0,-delta);
                }
            } 
      //  }
        
        
        var el = $(dom).get(0);
        //console.log("set capet "+el);
        if($(dom).html()!=""){
            var range = document.createRange();
            var sel = window.getSelection();
            if(el.childNodes!=undefined){
                var node=el.childNodes[el.childNodes.length-1];
                //console.log("nodeType "+node.nodeType);
                if(node.nodeType==3){
                    var len=node.length;
                    range.setStart(node, len);    
                }
                if(node.nodeType==1){
                    var len=node.firstChild.length;
                    range.setStart(node.firstChild, len);    
                }
            }else{
                var node=el.firstChild;
                range.setStart(node, node.length);
            }
            
            
            range.collapse(true)
            sel.removeAllRanges()
            sel.addRange(range)
       } 
        
    },
    blurText:function(){
        //console.log("blurtext");
        $(".focusing").blur();
        $(".focusing").each(function(e){
            $(this).removeClass("focusing");
            //console.log("remove border");
            $(this).css("border","none");
            if($(this).html().trim()==""){
                $(this).remove();
            }
        })
    },
    setTextStyle:function(style){
        
        if(style.font) this.currTextStyle.font=style.font;
        if(style.color) this.currTextStyle.color=style.color;
        if(style.size) this.currTextStyle.size=style.size;
        if(style.fill!=undefined) this.currTextStyle.fill=style.fill;
        if(style.align) this.currTextStyle.align=style.align;

        //update ui
        var size=this.currTextStyle.size;
        $("#btn_text_size").find("span").html(size);   
        $("#slider_text_thumb").css("background-color",this.currTextStyle.color);

        var self=this;
        $(".btn-color-text-small").each(function(e){
            $(this).empty();
            $(this).parent().css("border","none");
            var color=$(this).attr("data");
            if(color==self.currTextStyle.color){
                $(this).append($('<i class="material-icons">check</i>'))   
                $(this).parent().css("border","solid 1px #CCCCCC");
            }
        });

        if(this.currTextStyle.align=="left"){
            $("#btn_option_align").find("i").html("format_align_left");
        }
        if(this.currTextStyle.align=="right"){
            $("#btn_option_align").find("i").html("format_align_right");
        }
        if(this.currTextStyle.align=="center"){
            $("#btn_option_align").find("i").html("format_align_center");
        }

        if(this.currTextStyle.fill){
            $("#btn_option_fill").find("i").html("font_download");
        }else{
            $("#btn_option_fill").find("i").html("format_color_text");
        }

        //set text
        $(".focusing").css("font-family",this.currTextStyle.font);
        //$(".focusing").css("color",this.currTextStyle.color);
        $(".focusing").css("font-size",this.currTextStyle.size);
        $(".focusing").css("text-align",this.currTextStyle.align);
        if(!this.currTextStyle.fill){
            $(".focusing").css("color",this.currTextStyle.color);
            $(".focusing").css('background-color',"transparent");
        }else{
            $(".focusing").css("color","white");
            $(".focusing").css('background-color',this.currTextStyle.color);
        }
        $(".focusing").attr("styleText",JSON.stringify(this.currTextStyle).replaceAll("\"","'"));

        try{
            if(localStorage){
                localStorage.setItem("textStyle",JSON.stringify(this.currTextStyle));
            }
        }catch(e){

        }

    },
    addTouchTap:function(dom,callback){
        $(dom).on("touchstart",function(e){
            if(e.touches.length>1) return;
             $(this).attr("downx",e.touches[0].clientX);   
             $(this).attr("downy",e.touches[0].clientY);
             $(this).attr("movex",e.touches[0].clientX);   
             $(this).attr("movey",e.touches[0].clientY);  
             e.preventDefault();    
        });
        $(dom).on("touchmove",function(e){
            if(e.touches.length>1) return;
            $(this).attr("movex",e.touches[0].clientX);   
            $(this).attr("movey",e.touches[0].clientY);  
        });
        $(dom).on("touchend",function(e){
            var downx=parseInt($(this).attr("downx"));
            var downy=parseInt($(this).attr("downy"));
            var movex=parseInt($(this).attr("movex"));
            var movey=parseInt($(this).attr("movey"));
            if(Math.abs(downx-movex)<13 && Math.abs(downy-movey)<13){
                if(callback) {
                    callback();
                }   
            }
            //e.stopPropagation();
            e.preventDefault();
        })
        $(dom).on("mouseup",function(e){
            if(callback) {
                callback();
            }
        })
    },
    /*** add text  */

    /** help */

    /** help */

    /** mark */
     updateMark:function(value){
         this.countWrong=$(".wrong").length;
         this.countRight=$(".correct").length;
        
        this.countWrong=(this.countWrong<0)? 0:this.countWrong;
        this.countRight=(this.countRight<0)? 0:this.countRight;
        var markCount=this.countRight+this.countWrong;
        
        this.point=0;;//(value)? value:(10*this.countRight/markCount).toFixed(1);
        if(markCount>0){
            var pointfix=(10*this.countRight/markCount).toFixed(1);
            var strmark=(this.mnotedata.hideMark==true)? "":' = '+pointfix+' Điểm ';
            $("#mnote_mark_result").html('Trả lời đúng '+this.countRight+' / '+markCount+ strmark+'.    <span style="color: green;margin-left: 20px;">đ : '+this.countRight+' </span> <span style="color: red;margin-left:20px ;">s : '+this.countWrong+'</span>');
            this.point=(value!=undefined && value!=null)? value:pointfix;
        }else{
            $("#mnote_mark_result").html("Chưa có số câu đúng , câu sai ");
            this.point=value;
        }
        //console.log("udpate mark "+value+":"+markCount);
        if(isNaN(this.point)) this.point=0;
        $("#mark_number_txt").val(this.point);
        var self=this;
        $(".btn-mark-chose-bt").each(function(){
            $(this).css("background-color","#e0e0e0");
            $(this).find("span").css("color","#444444");
            if(parseInt($(this).attr("data"))==Math.round(self.point)){
                $(this).css("background-color","red");
                $(this).find("span").css("color","white");
            }
        })
     },
     initMarkUI:function(){
        $(".mnote_mark_point_txt").focus(()=>{
            var diveditdom=$("#mnote_mark").get(0);
            var boundingBox=diveditdom.getBoundingClientRect();
            var delta=0;
            if(boundingBox.top>100){
                delta=boundingBox.top-100;
            }
            if(this.panzoom){
                this.panzoom.moveBy(0,-delta);
            }

            this.markTxtFocus=true;
            this.setMode(this.MODE_NORMAL);
            //this.panzoom.moveBy(0,-delta);
            //$("#mnote_container").css("transform","matrix(1, 0, 0, 1, 0, -1900)");
        })
        $(".mnote_mark_point_txt").blur(()=>{
            //console.log("focus text input");
            this.markTxtFocus=false;
        })
        var self=this;
        $("#mark_comment_txt").on("input",function(e){
            self.resizeTxtComment();
        });
        for(var i=10;i>=0;i--){
            var div=$('<div class="btn-mark-chose"><div data="'+i+'" class="btn-mark-chose-bt  btn-floating waves-effect waves-light" style="background-color:#e0e0e0"><span style="color:#444444">'+i+'</span></div></div>');
            $("#mnote_mark_chose").append($(div));
            if(i==10){
                $(div).find("span").css("left","30px");
            }
        }

        $("#mnote_mark_chose").on("touchstart",(e)=>{
            e.preventDefault();
        })
        $(".btn-mark-chose-bt").each(function(){
            
            self.addTouchTap($(this),()=>{
                self.updateMark(parseInt($(this).attr("data")));
            })

           
        })

        $("#mnote_mark_hide").on("mouseup touchend",(e)=>{
            if(self.mnotedata.hideMark==true){
                self.showMark();
                self.updateMark();
            }else{
               self.hideMark();
               self.updateMark();
            }
            e.preventDefault();
        })
        var input=$("#switch_hide_mark").find("input")[0];

        $(input).on("change",function(e){
            if(this.checked){
                self.showMark();
            }else{
                self.hideMark();
            }
            e.stopPropagation();
            e.preventDefault();
        })


        $("#mark_number_txt").on("input",()=>{
            var floorMath=Math.floor($("#mark_number_txt").val());
            if(!isNaN(floorMath)){
                $(".btn-mark-chose-bt").each(function(){
                    $(this).css("background-color","#e0e0e0");
                    $(this).find("span").css("color","#444444");
                    if(parseInt($(this).attr("data"))==floorMath){
                        $(this).css("background-color","red");
                        $(this).find("span").css("color","white");
                    }
                })
            }
        })
       
        $("#mark_comment_txt").on("touchstart",(e)=>{
            //e.preventDefault();
        })


        //init emoji
        
        $("#mnote_mark_emoji_bt").click(()=>{
            if($("#emoji_chosen").css("display")=="block"){
                $("#emoji_chosen").css("display","none");
            }else{
                $("#emoji_chosen").css("display","block");
                if($(".emoji_chosen").length==0){
                    for(var i=1;i<20;i++){
                        var img=$("<img class='emoji_chosen' src='images/emoji/emoji"+i+".gif' width='80' height='80'/>");
                        $("#emoji_chosen_container").append($(img));
                        $(img).css("cursor","pointer");
                        /*$(img).click(function(){
                            self.addCommentEmoji($(this).attr("src"));
                        })*/
                    }
                    $("#emoji_chosen_container").width(80*(i+1)+"px");
                    var self=this;
                    $(".emoji_chosen").click(function(){
                        self.addCommentEmoji([$(this).attr("src")]);
                    })
                }
            }
        })
     },
     
     hideMark:function(notUpdate){
       // $("#mnote_mark_hide").html("Hiện điểm");
       this.mnotedata.hideMark=true;
       $("#switch_hide_mark").find("input")[0].checked=false;
        $("#mnote_mark_number").css("display","none");
        $("#mnote_mark_comment").css("width","100%");
        $("#mnote_mark_chose").css("display","none");
        this.mnotedata.point=0;
        if(notUpdate){

        }else{
            try{
                localStorage.setItem("hideMark","true");
            }catch(e){
                //console.log("localstorage not support");
            }
        }
        
     },
     showMark:function(notUpdate){
       // $("#mnote_mark_hide").html("Ẩn điểm");
       this.mnotedata.hideMark=false;
       $("#switch_hide_mark").find("input")[0].checked=true;
        $("#mnote_mark_number").css("display","block");
        $("#mnote_mark_comment").css("width","65%");
        $("#mnote_mark_chose").css("display","block");
        if(notUpdate){
            
        }else{
            try{
                localStorage.setItem("hideMark","false");
            }catch(e){
                //console.log("localstorage not support");
            }
        }
     },

     resizeTxtComment:function(){
         var txtComment=document.getElementById("mark_comment_txt");
         var txtCommentH=$(txtComment).height();
         txtCommentH=(txtCommentH<200)? 200:txtCommentH;
         var nh=txtCommentH+130+$("#mnote_mark_emoji").height();
         if(this.mnotedata && this.mnotedata.mode=="view") nh+=80;
         $("#mnote_mark_point").css("height",nh+"px");
         $("#mark_number_txt").css("margin-top",(nh-68-150)/2+"px"); 
         var mt=$("#mnote_mark_emoji_container").height()-50;
         mt=(mt<0)? 0:mt;
         $("#mnote_mark_emoji_bt").css("margin-top",mt+"px");

         
        // txtComment.style.height = "";
        // txtComment.style.height = Math.min(txtComment.scrollHeight, 200) + "px";

        //    var areaheight=txtComment.scrollHeight;
        //    var h=parseInt($(txtComment).css("height"));
        //    //console.log("resize text : "+areaheight);
           /* if(areaheight>h){
                var nh=areaheight+130+$("#mnote_mark_emoji").height();
               // $(txtComment).css("height",(areaheight)+"px");
              // txtComment.style.height=(areaheight)+"px";
                $("#mnote_mark_point").css("height",nh+"px");
                $("#mark_number_txt").css("margin-top",(nh-68-150)/2+"px"); 
            }else{
               // $(txtComment).css("height","200px");
               // var nh=300+$("#mnote_mark_emoji").height();
               // $("#mnote_mark_point").css("height",nh+"px");
            }
            var mt=$("#mnote_mark_emoji_container").height()-50;
            mt=(mt<0)? 0:mt;
            $("#mnote_mark_emoji_bt").css("margin-top",mt+"px");
           // this.addCommentEmoji("images/emoji/emoji2.gif");   */ 
     },


     /** emoji */
     addCommentEmoji:function(arrUrl){
        for(var i=0;i<arrUrl.length;i++){
            var img=$('<img class="comment_emoji" src="'+arrUrl[i]+'" width="120" height="120"/>');
            $("#mnote_mark_emoji_container").append($(img));
            var self=this;
            $(img).css("cursor","pointer");
            $(img).click(function(e){
                if(self.mnotedata.mode=="edit"){
                    $(this).remove();
                    self.resizeTxtComment();
                }
            });
            /*if(is_touch_device()){
                $(img).click(function(e){
                    $(this).remove();
                    self.resizeTxtComment();
                });
            }else{
                $(img).dblclick(function(e){
                    $(this).remove();
                    self.resizeTxtComment();
                });
            }*/
            
        }
        this.resizeTxtComment();
     },
     /**  */

     initStaticTextSetting:function(){

        this.staticTextConfig={
            urlImgCorrect:"images/rightwrong/right1.png",
            urlImgWrong:"images/rightwrong/wrong1.png",
            textCorrect:"đ",
            textWrong:"s",
            useCorrectText:true,
            useWrongText:true,
            correctWidth:50,
            correctHeight:50,
            wrongWidth:50,
            wrongHeight:50,
            fontText:"font_chu_dep",
            fontSize:30,
            fontColor:"red"
        }


        try{
            var localStaticConfig=localStorage.getItem("staticTextConfig");
            if(localStaticConfig){
                this.staticTextConfig=JSON.parse(localStaticConfig);
            }else{
                //getlocalstorage from iframe
                document.getElementById("ifclasslive").src="https://classlive.stume.net/localstorage.html"
            }
        }catch(e){
            //console.log("error parse local staticTextConfig");
        }
        

        $("#setting_static_text_size").on("input",()=>{
            $(".setting_text").css("font-size",$("#setting_static_text_size").val()+"px");
        })

        $("#setting_static_text_font").on("change",()=>{
            $(".setting_text").css("font-family",$("#setting_static_text_font").val());
        })

        $("#setting_static_text_close").click(()=>{
            this.hideStaticTextSetting();
        })

        $("#static_text_txt_menu").click(()=>{
            $("#mnote_static_text_txt").css("display","block");
            $("#mnote_static_text_img").css("display","none");
        });

        $("#static_text_img_menu").click(()=>{
            $("#mnote_static_text_txt").css("display","none");
            $("#mnote_static_text_img").css("display","block");
            this.initStaticTextImageChosen();
        });

        this.resizeTxtComment();

        $('select').formSelect();

        $("#setting_static_text_submit").click(()=>{
            var textCorrect=$("#setting_text_correct").html().trim();
            if(textCorrect=="") textCorrect="đ";
            this.staticTextConfig.textCorrect=textCorrect;
            this.staticTextConfig.useCorrectText=true;

            var textWrong=$("#setting_text_wrong").html().trim();
            if(textWrong=="") textWrong="s";
            this.staticTextConfig.textWrong=textWrong;
            this.staticTextConfig.useWrongText=true;

            this.staticTextConfig.fontText=$("#setting_static_text_font").val();
            this.staticTextConfig.fontSize= $("#setting_static_text_size").val();

            this.staticTextConfig.correctWidth=$("#setting_text_correct").width();
            this.staticTextConfig.correctHeight=$("#setting_text_correct").height();
            this.staticTextConfig.wrongWidth=$("#setting_text_wrong").width();
            this.staticTextConfig.wrongHeight=$("#setting_text_wrong").height();

            $(".wrong").css("font-family",this.staticTextConfig.fontText);
            $(".wrong").css("font-size",this.staticTextConfig.fontSize);
            $(".wrong").find("span").html(this.staticTextConfig.textWrong);

            $(".correct").css("font-family",this.staticTextConfig.fontText);
            $(".correct").css("font-size",this.staticTextConfig.fontSize);
            $(".correct").find("span").html(this.staticTextConfig.textCorrect);

            $(".wrong").find("span").css("display","block");
            $(".wrong").find("img").css("display","none");
            $(".correct").find("span").css("display","block");
            $(".correct").find("img").css("display","none");

           // cc.log("static text setting "+JSON.stringify(this.staticTextConfig));
           try{
                localStorage.setItem("staticTextConfig",JSON.stringify(this.staticTextConfig));
           }catch(e){

           }
            this.hideStaticTextSetting();

        })

        $("#setting_static_img_submit").click(()=>{
           this.staticTextConfig.useCorrectText=false;
           this.staticTextConfig.useWrongText=false;

           this.staticTextConfig.correctWidth=50;
            this.staticTextConfig.correctHeight=50;
            this.staticTextConfig.wrongWidth=50;
            this.staticTextConfig.wrongHeight=50;

            this.staticTextConfig.urlImgCorrect=$("#static_img_corect").attr("src");
            this.staticTextConfig.urlImgWrong=$("#static_img_wrong").attr("src");

            $(".correct_img").attr("src",this.staticTextConfig.urlImgCorrect);
            $(".wrong_img").attr("src",this.staticTextConfig.urlImgWrong);

            $(".wrong").find("span").css("display","none");
            $(".wrong").find("img").css("display","block");
            $(".correct").find("span").css("display","none");
            $(".correct").find("img").css("display","block");
            
           try{
                localStorage.setItem("staticTextConfig",JSON.stringify(this.staticTextConfig));
           }catch(e){

           }
            this.hideStaticTextSetting();
        })
     },

     showStaticTextSetting:function(){
        $("#setting_static_text").css("display","block");

        $("#setting_text_correct").html(this.staticTextConfig.textCorrect);
        $("#setting_text_wrong").html(this.staticTextConfig.textWrong);
        $(".setting_text").css("font-size",this.staticTextConfig.fontSize+"px");
        $(".setting_text").css("font-family",this.staticTextConfig.fontText);
        $("#setting_static_text_size").val(this.staticTextConfig.fontSize);
        $("#setting_static_text_font").val(this.staticTextConfig.fontText);
        $('select').formSelect();

        if(this.staticTextConfig.urlImgCorrect=="") this.staticTextConfig.urlImgCorrect="images/rightwrong/right1.png";
        if(this.staticTextConfig.urlImgWrong=="") this.staticTextConfig.urlImgWrong="images/rightwrong/wrong1.png";

        $("#static_img_corect").attr("src",this.staticTextConfig.urlImgCorrect);
        $("#static_img_wrong").attr("src",this.staticTextConfig.urlImgWrong);

        if(this.staticTextConfig.useCorrectText){
            $("#mnote_static_text_txt").css("display","block");
            $("#mnote_static_text_img").css("display","none");
        }else{
            $("#mnote_static_text_txt").css("display","none");
            $("#mnote_static_text_img").css("display","block");

            this.initStaticTextImageChosen();
        }
        
     },
     
     hideStaticTextSetting:function(){
        $("#setting_static_text").css("display","none");
     },
     initStaticTextImageChosen:function(){
        if($(".static_img_correct").length==0){
            for(var i=1;i<6;i++){
                var imgr=$("<img class='static_img_correct' src='images/rightwrong/right"+i+".png' width='30' height='30'/>");
                $("#static_img_corect_container").append($(imgr));
                var imgw=$("<img class='static_img_wrong' src='images/rightwrong/wrong"+i+".png' width='30' height='30'/>");
                $("#static_img_wrong_container").append($(imgw));
            }

            $(".static_img_correct").click(function(){
                $("#static_img_corect").attr("src",$(this).attr("src"));
            })
            $(".static_img_wrong").click(function(){
                $("#static_img_wrong").attr("src",$(this).attr("src"));
            })
        }
     },

     initMathEditor:function(){
        if(is_touch_device()){
            $("#math_editor").css("height",window.innerHeight-60);
            $("#math_editor").css("top","60");
        }
        $("#math_editor_close").click(()=>{
            this.hideMathEditor();
        })
        $("#math_editor_submit").click(()=>{
            //console.log("getEditor    :"+this.myEditor.getLatex());



        })

        this.myEditor = new MathEditor('mathquill_editor');
        this.myEditor.styleMe({
                textarea_background:"#FFFFFF",
                textarea_foreground:"#FF0000",
                textarea_border:"#000000",
                toolbar_background:"#FFFFFF",
                toolbar_foreground:"#000000",
                toolbar_border:"#000000",
                button_background:"#FFFFFF",
                button_border:"#000000",
        });
     },

     showMathEditor:function(){
        $("#math_editor").css("display","block");
        this.myEditor.setLatex("");
     },
     hideMathEditor:function(){
        $("#math_editor").css("display","none");
     },

     convertCoordGlobalToLocal(x,y){
         var pos={
             x:x,
             y:y
         }

         pos.x=x*this.pageScale;
         pos.y=y*this.pageScale;
         var scrollTop=0;
         if(!is_touch_device()){
            scrollTop=document.getElementById("mnote_content").scrollTop;
         }else{

         }
         pos.y+=scrollTop;
         return pos;

     },
     exportPdf:function(){
        showLoading();
        this.zipExport = new JSZip();
        $(".bt-edit-bg").css("display","none");

        setTimeout(()=>{
            this.exportPdfPage(0);
        },300);
        
        
       // zip.file("smile.gif", imgData, {base64: true});
      /*  zip.generateAsync({type:"blob"}).then(function(content) {
            // see FileSaver.js
            var filename=this.mnotedata.classname+"_"+this.mnotedata.fullname+"_"+this.mnotedata.homeworkTime+"_"+this.mnotedata.homework;
            saveAs(content, filename+".zip");
        });*/
     },
     exportPdfPage:function(index){
         //console.log("export page "+index);
         if(index<0) index=0;
         if(index>=this.pageCount){
             //finish export page
             html2canvas(document.querySelector("#mnote_mark_point"),{
                useCORS: true,
            }).then(canvas => {
                var base64=canvas.toDataURL("image/jpeg",70);
                //if(index==0) //console.log(base64);
                base64=base64.substr(23);
                this.zipExport.file("diem_loiphe.jpg",base64,{base64:true});

                var filename=this.mnotedata.classname+"_"+this.mnotedata.fullname+"_"+this.mnotedata.homeworkTime+"_"+this.mnotedata.homework;
                this.zipExport.generateAsync({type:"blob"}).then(function(content) {
                    // see FileSaver.js
                    hideLoading();
                    $(".bt-edit-bg").css("display","block");
                    saveAs(content, filename+".zip");
                })
                //this.exportPdfPage(index+1);
            })
            return;
         }

        html2canvas(document.querySelector("#page_"+index),{
            useCORS: true,
        }).then(canvas => {
            var base64=canvas.toDataURL("image/jpeg",70);
            //if(index==0) //console.log(base64);
            base64=base64.substr(23);
            this.zipExport.file("trang_"+index+".jpg",base64,{base64:true});
            this.exportPdfPage(index+1);
        })
     },
     exportPdf_:function(){
        showLoading();
        //switch to view mode to export 
        $("#mnote_mark_chose").css("display","none");
        $("#btn_save_data").css("display","none");
        $("#mnote_hold_bt").css("display","none");
        $("#mnote_setting_bt").css("display","none");
        $("#hide_mark").css("display","none");
        var montePosy=$("#mnote_mark").css("top");
        $("#mnote_mark").css("top","36px");
        $("#mnote_mark_hide").css("display","none");
        var h=$("#mnote_mark_point").height()+20;
        $("#mnote_pages").css("padding-top",h+"px");
        var h1=$("#mnote_user_info").height()-10;
        $("#mnote_pages").css("margin-top",h1+"px");
        $("#mnote_mark_result").css("display","none");
        $("#mnote_mark_emoji_bt").css("display","none");
        $("#mnote_help").css("display","none");
        $("#mnote_mark_emoji_bt").css("display","none");
        $("#mnote_user_info").css("display","block");
        $(".bt-edit-bg").css("display","none");
        $("#emoji_chosen").css("display","none");
        var filename=this.mnotedata.classname+"_"+this.mnotedata.fullname+"_"+this.mnotedata.homeworkTime+"_"+this.mnotedata.homework;

        setTimeout(()=>{
            html2canvas(document.querySelector("#mnote_container"),{
                useCORS: true,
            }).then(canvas => {
                //document.body.appendChild(canvas)
                var link = document.createElement('a');
                link.download = filename+'.jpg';
                link.href = canvas.toDataURL("image/jpeg",0.9);
                link.click();

                $("#mnote_mark_chose").css("display","block");
                $("#btn_save_data").css("display","block");
                $("#mnote_hold_bt").css("display","block");
                $("#mnote_setting_bt").css("display","block");
                $("#hide_mark").css("display","flex");
                $("#mnote_mark").css("top",montePosy);
                $("#mnote_mark_hide").css("display","block");
                $("#mnote_pages").css("padding-top","0px");
                $("#mnote_pages").css("margin-top","0px");
                $("#mnote_mark_result").css("display","flex");
                $("#mnote_mark_emoji_bt").css("display","block");
                $("#mnote_help").css("display","block");
                $("#mnote_mark_emoji_bt").css("display","block");
                $("#mnote_user_info").css("display","none");
                $(".bt-edit-bg").css("display","block");
                hideLoading();
            });
        },1000);
     },

     isPanzoomEnable:function(){
        if(this.mode==this.MODE_DRAWRING){
            if(this.currBrush==this.BRUSH_PEN 
            || this.currBrush==this.BRUSH_ERASE
            || this.currBrush==this.BRUSH_LINE
            || this.currBrush==this.BRUSH_RECTANGLE
            || this.currBrush==this.BRUSH_CIRCLE
            || this.currBrush==this.BRUSH_ARROW
             ) return false;
        }
        if(this.mode==this.MODE_ENTER_TEXT){
            return false;
        }
        if(this.markTxtFocus==true) return false;
        return true;
     }, 
     onresize:function(width,height,delay){
        //alert("resize");
        if(is_touch_device()){
            if(this.appWidth==width && this.appHeight>height && this.appHeight>0){
                //show keyboard
            }
            if(this.appWidth==width && this.appHeight<height && this.appHeight>0){
                //hide keyboard
                this.blurText();
                $(".mnote_mark_point_txt").blur();

            }
        }
        
        if(this.appHeight==0 && delay){
            if(is_touch_device() && height<200){
                setTimeout(()=>{
                    this.onresize(window.innerWidth,window.innerHeight);
                },3000);
            }
        }

         this.appWidth=width;
         this.appHeight=height;
        $("#mnote_app").css("height",height+"px"); 

        $(this.note_content).css("height",height+"px");
        $(this.note_pages).width(this.pageWidth);
        this.pageScale=($(this.note_content).width())/this.pageWidth;
        //this.pageScale=1;
        $(this.note_pages).css("transform","scale("+this.pageScale+")");

        if(navigator.userAgent.toLowerCase().indexOf("ipad")>=0){
            $(this.note_container).height($(this.note_pages).height()*this.pageScale+1.5*window.innerHeight+500);
        }else{
            $(this.note_container).height($(this.note_pages).height()*this.pageScale+1.5*window.innerHeight);
        }
        
        /*if (this.mnotedata.mode=="edit" && getOs()=="web"){
            $(this.note_container).height($(this.note_container).height()+300);
        }*/
     }
})

var MNote=(function(){
    var instance;
    function createInstance() {
        var object = new MNote_instance();
        return object;
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
        releaseInst:function(){
            instance=null;
        },
        inst:function(){
            return this.getInstance();
        }
    };
})();

function loadCss(){
    var head = document.getElementsByTagName( "head" )[0],
    body = document.body,
    css = document.createElement( "link" ),
    img = document.createElement( "img" ),
    cssUrl = "css/mnote_u.css?t="+new Date().getTime();

    css.href = cssUrl;
    css.rel = "stylesheet";
    head.appendChild( css );

    startApp();

}

function startApp(){
    
    $("#root").css("display","block");
    mnote=MNote.getInstance();

   // var arrPage=[{"width":750,"height":1334,"id":1,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[],"objText":[{"x":406,"y":454,"value":"Vbjutg<div>Vhhjj</div>","textStyle":{"font":"handwriting_font","size":40,"align":"left","color":"red","fill":false}},{"x":225,"y":942,"value":"Ghhrt<div>Ghhj</div>","textStyle":{"font":"handwriting_font","size":40,"align":"center","color":"red","fill":true}}]},{"width":750,"height":1334,"id":0,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[{"x":363,"y":808,"value":"correct"},{"x":485,"y":663,"value":"correct"},{"x":451,"y":837,"value":"correct"},{"x":324,"y":1026,"value":"correct"},{"x":476,"y":976,"value":"wrong"},{"x":544,"y":831,"value":"wrong"},{"x":439,"y":1140,"value":"wrong"},{"x":88,"y":836,"value":"wrong"},{"x":256,"y":594,"value":"wrong"},{"x":242,"y":748,"value":"correct"}],"objText":[]},{"width":750,"height":1334,"id":3,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[],"objText":[]},{"width":750,"height":1334,"id":2,"backgroundImage":"images/test3.jpg?t=2","rotation":0,"staticText":[],"objText":[]},{"width":750,"height":1334,"id":4,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[],"objText":[]},{"width":750,"height":1334,"id":5,"backgroundImage":"images/test1.jpg?t=2","rotation":0,"staticText":[],"objText":[]}];
   // var arrPage=[{"width":750,"height":1334,"id":1,"backgroundImage":"images/test1.jpg","rotation":0,"staticText":[{"x":254,"y":1003,"value":"correct"},{"x":402,"y":974,"value":"correct"},{"x":449,"y":1109,"value":"correct"},{"x":602,"y":1188,"value":"correct"},{"x":369,"y":1188,"value":"correct"}],"objText":[]},{"width":750,"height":450,"id":0,"backgroundImage":"https://player.vimeo.com/video/606881153","staticText":[],"objText":[]}];
    /*var mnotedata={
        pages:arrPage,
        commentEmoji:["images/emoji/emoji2.gif","images/emoji/emoji3.gif","images/emoji/emoji4.gif","images/emoji/emoji5.gif"],
        
        mode:"edit"
    }*/

    //var mnotedata={"cmd":"initMNote","pages":arrPage,"answer_obj":{"id":263170,"homeworkId":20310,"studentId":385558,"note":null,"resendNote":null,"point":0,"result":null,"resultExams":null,"files":"[{\"name\":\"Screen Shot 2021-02-18 at 7.29.06 PM.png\",\"path\":\"/storage_public/azota/fcadb3c7cc7f65d8152b72365a39bba6_3862c1badd5e4e4395f3855cf10817ce1614226256.png\",\"extension\":\"png\",\"mimes\":\"image/png\",\"size\":\"13593\",\"url\":\"https://cdn.azota.vn/api/download_public/storage_public/azota/fcadb3c7cc7f65d8152b72365a39bba6_3862c1badd5e4e4395f3855cf10817ce1614226256.png\"}]","testbankExams":"[]","confirmedAt":null,"createdAt":"2021-02-25T11:11:00","updatedAt":"2021-02-25T11:11:00","homework":null,"student":null},"student_obj":{"id":385558,"code":null,"fullName":"hunglt","birthday":"2021-02-25T00:00:00","gender":0,"classroomId":19804,"parentId":413863,"createdAt":"2021-02-25T11:10:50","updatedAt":"2021-02-25T11:10:50","classroom":{"id":19804,"name":"test lop","teacherId":413838,"countStudents":1,"status":true,"showAddStudent":1,"createdAt":"2021-02-25T11:10:13","updatedAt":"2021-02-25T11:10:13","teacher":null,"homeworks":[],"students":[]},"answers":[{"id":263170,"homeworkId":20310,"studentId":385558,"note":null,"resendNote":null,"point":0,"result":null,"resultExams":null,"files":"[{\"name\":\"Screen Shot 2021-02-18 at 7.29.06 PM.png\",\"path\":\"/storage_public/azota/fcadb3c7cc7f65d8152b72365a39bba6_3862c1badd5e4e4395f3855cf10817ce1614226256.png\",\"extension\":\"png\",\"mimes\":\"image/png\",\"size\":\"13593\",\"url\":\"https://cdn.azota.vn/api/download_public/storage_public/azota/fcadb3c7cc7f65d8152b72365a39bba6_3862c1badd5e4e4395f3855cf10817ce1614226256.png\"}]","testbankExams":"[]","confirmedAt":null,"createdAt":"2021-02-25T11:11:00","updatedAt":"2021-02-25T11:11:00","homework":null,"student":null}]},"classroom_obj":{"id":19804,"name":"test lop","teacherId":413838,"countStudents":1,"status":true,"showAddStudent":1,"createdAt":"2021-02-25T11:10:13","updatedAt":"2021-02-25T11:10:13","teacher":null,"homeworks":[],"students":[]},"homework_obj":{"id":20310,"hashId":"p3h3q6","name":"Bài tập","classroomId":19804,"content":"<p>B&agrave;i tập trong s&aacute;ch gi&aacute;o khoa số 2&nbsp;</p>","deadline":"2021-02-26T00:00:00","type":null,"count":1,"files":"null","testbankExams":"null","createdAt":"2021-02-25T11:10:28","updatedAt":"2021-02-26T10:14:35","classroom":null,"answers":[]},"mode":"edit"}
    //mnote.initNote(mnotedata);
}

loadCss();


