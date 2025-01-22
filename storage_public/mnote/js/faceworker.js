importScripts('face-api.min.js');

async function initFaceAPI() {

    await faceapi.loadTinyFaceDetectorModel('weights')
    await faceapi.loadFaceRecognitionModel('weights')
    await faceapi.loadFaceExpressionModel('weights')

    //console.log(faceapi.nets);
    postMessage("init faceapi complete");
    
}

initFaceAPI();


var i = 0;

function timedCount() {
  i = i + 1;
  postMessage(i);
  setTimeout("timedCount()",500);
}

//timedCount();