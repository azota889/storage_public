var aztExam=aztExam || {};
aztExam.iframeTeacher='<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><script src="https://azota889.github.io/storage_public/almo/allmo.js?ver='+new Date().getTime()+'"></script></head><body style="margin: 0px;padding: 0px;"><script>document.addEventListener("DOMContentLoaded", function(event) { console.log("on init"); window.parent.aztExam.onTeacherIframeInt();	});function startMonitor(options){var monitor=aztExam.MonitorTeacher.getInstance();monitor.start(options);document.body.appendChild(monitor.app);}</script></body></html>';
aztExam.isLoadedMonitor=false;
aztExam.optionsTeacher=null;
aztExam.loadMonitor=function(callback){
    if(aztExam.isLoadedMonitor) {
        callback();
        return;
    }
    try{
        var js = document.createElement("script");
        js.onload=()=>{
            // aztExam.isLoadedMonitor=true;
            // if(callback) callback();
        };
        js.onerror=()=>{
            
        }
        js.src = "js/allmo.js?ver="+new Date().getTime();
        js.async = true;
        document.head.appendChild(js);
    }catch(e){
        alert(e);
    }
    
}
aztExam.showMonitorTeacher=function(options){
    aztExam.removeMonitorTeacher();
    var iframe=document.createElement('iframe');
    iframe.style.width="100%";
    iframe.style.height="100%";
    iframe.style.padding="0px";
    iframe.style.margin="0px";
    iframe.style.zIndex="9999999999";
    iframe.style.border="none";
    iframe.style.backgroundColor="gray";
    iframe.style.position="absolute";
    iframe.style.top="0px";
    iframe.style.left="0px";
    iframe.setAttribute("id","aztExamTeacherMonitor");
    document.body.appendChild(iframe);  
    aztExam.optionsTeacher=options;
   var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
   // iframedoc.body.innerHTML = aztExam.iframeTeacher;
   iframedoc.write(aztExam.iframeTeacher);
   iframedoc.close();

   //console.log("write done");
    
}
aztExam.removeMonitorTeacher=function(){
    var iframe=document.getElementById("aztExamTeacherMonitor");
    if(iframe){
        iframe.parentNode.removeChild(iframe);
    }
}
aztExam.onTeacherIframeInt=function(){
    console.log("onTeacherIframeInit");
    var iframe=document.getElementById("aztExamTeacherMonitor");
    if(iframe){
        //var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframe.contentWindow.startMonitor(aztExam.optionsTeacher);
    }
}