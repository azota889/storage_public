var aztExam=aztExam || {};
aztExam.loadMonitor=function(callback){
    var js = document.createElement("script");
    js.onload=()=>{
        if(callback) callback();
    };
    js.onerror=()=>{
    }
    js.src = "https://azota889.github.io/storage_public/almo/allmo.js?ver="+new Date().getTime();
    js.async = true;
    document.header.appendChild(js);
}