function log(str){
    var timestamp=new Date().toISOString();
    var strlog=timestamp.substr(timestamp.length-13,13)+"--"+ str;
    console.log(strlog);
}
var opencvloaded=false;
var isInit=false;
var isProcessing=false;
var urlBase="https://azota889.github.io/storage_public/almo/";
//var urlBase="";
var checkOpencv=setInterval(()=>{
    if(cv!=null && cv.Mat!=null && cv.Mat!=undefined && cv.CascadeClassifier!=undefined){
        clearInterval(checkOpencv);
        opencvloaded=true;
        init();
        self.postMessage({
            cmd:"opencvloaded"
        });
    }else{
        log("loading opencv");
    }
},1000);

onmessage = function (e) {
    if(!e.data) return;
    switch (e.data.cmd) {
      case 'processimage': {
            if(opencvloaded && isInit && !isProcessing){
                detectEye(e.data.obj);
            }
        break
      }
      default:
        break
    }
}
var eyeClassifier=null;
let faceClassifier = null;
function init(){

    let eyeClassifierFile = 'haarcascade_eye.xml'; // path to xml
    
    let faceClassifierFile='haarcascade_frontalface_default.xml';

    // use createFileFromUrl to "pre-build" the xml
    createFileFromUrl(eyeClassifierFile, eyeClassifierFile, () => {
        eyeClassifier = new cv.CascadeClassifier();  // initialize classifier
        eyeClassifier.load(eyeClassifierFile); // in the callback, load the cascade from file 
    });
    createFileFromUrl(faceClassifierFile, faceClassifierFile, () => {
        faceClassifier = new cv.CascadeClassifier();  // initialize classifier
        faceClassifier.load(faceClassifierFile); // in the callback, load the cascade from file 
        isInit=true;
    });
}
createFileFromUrl = function(path, url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET',urlBase+url, true);
    request.responseType = 'arraybuffer';
    request.onload = function(ev) {
        request = this;
        if (request.readyState === 4) {
            if (request.status === 200) {
                let data = new Uint8Array(request.response);
                cv.FS_createDataFile('/', path, data, true, false, false);
                callback();
            } else {
                console.error('Failed to load ' + url + ' status: ' + request.status);
            }
        }
    };
    request.send();
}
function detectEye(obj){
     // log("start detect");
      isProcessing=true;
      let srcMat = cv.matFromImageData(obj.imagedata);  
      let grayMat=new cv.Mat();
      cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);
      if(!obj.isMobile){
          cv.resize(grayMat,grayMat,new cv.Size(3*grayMat.cols,3*grayMat.rows),0,0,cv.INTER_AREA);
      }

      foundEyes=[];
      foundFace=[];

      
      if(faceClassifier){
        //log("start face");
        let faceVect = new cv.RectVector();
        let faceMat = grayMat.clone();
        //cv.pyrDown(grayMat, faceMat);
        faceClassifier.detectMultiScale(faceMat, faceVect);
          for (let i = 0; i < faceVect.size(); i++) {
             let face = faceVect.get(i);
             //faces.push(new cv.Rect(face.x, face.y, face.width, face.height));
             //log("found face "+face.x+":"+face.y);
             //isFoundFace=true;
             foundFace.push({
                x:face.x,y:face.y,width:face.width,height:face.height
             })
          }
          faceMat.delete();
          faceVect.delete(); 
        //log("end face");
      }
      
      if(foundFace.length==0){
        if(eyeClassifier){
            //log("start Eye");
            let eyeVect = new cv.RectVector();
            let eyeMat = grayMat.clone();
           // cv.pyrDown(grayMat, eyeMat);
            eyeClassifier.detectMultiScale(eyeMat, eyeVect);
            for (let i = 0; i < eyeVect.size(); i++) {
                let eye = eyeVect.get(i);
                //eyes.push(new cv.Rect(eye.x, eye.y, eye.width, eye.height));
               // log("found eyes "+eye.x+":"+eye.y);
               // isFoundEyes=true;
               if(foundEyes.length==0){
                    foundEyes.push({
                        x:eye.x,y:eye.y,width:eye.width,height:eye.height
                })
               }
            }
            eyeMat.delete();
            eyeVect.delete();
            //log("end Eye")
          }
      }
      
      srcMat.delete();
      grayMat.delete();
      isProcessing=false;
    
      //log("end detect");
      self.postMessage({
        cmd:"processimage",
        obj:{
           timestamp:obj.timestamp,
           index:obj.index,
           startTime:obj.startTime,
           foundEyes:foundEyes,
           foundFace:foundFace
        }
    });
}
importScripts(urlBase+"opencv.js");