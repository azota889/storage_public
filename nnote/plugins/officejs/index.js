var pluginId="officejs";
var nPlugin=null;
var P_EVENT={
    START_LOAD:"start_load",
    PAGE_COUNT:"page_count"
}

window.addEventListener("DOMContentLoaded",()=>{
    nPlugin=new notePlugin(pluginId);
    nPlugin.on(P_EVENT.START_LOAD,(data)=>{
        if(data 
            && data.link 
            && typeof data.link =="string"
            ){
                parseDoc(link);
            }
    })
    var query = nPlugin.getQueryParams(document.location.search);
    //console.log("domloaded : "+document.location.search);
    if(query.src){
        parseDoc(query.src);
    }
})

function parseDoc(link){   
    fetch(link)       
    .then(function (response) {                       
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response.blob());
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    })
    .then(JSZip.loadAsync)                            
    .then(function (zip) {
        var pathAppXml="docProps/app.xml";
        var maxNumberSlide=0;
        var pathSlideXml="ppt/slides/slide";
        var hasAppXml=false;
       //var pathAppXml="ppt/tableStyles.xml";
       // return zip.file(pathAppXml).async("string");

       zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
           if(zipEntry.name.indexOf(pathAppXml)>=0){
                hasAppXml=true;
           }
           if(zipEntry.name.indexOf(pathSlideXml)>=0){
                var num=parseInt(zipEntry.name.replace(pathSlideXml,""));
                if(!isNaN(num) && num>maxNumberSlide) maxNumberSlide=num;
           }
        });

       if(hasAppXml==true){
            return zip.file(pathAppXml).async("string");
       }else{
            nPlugin.sendData(pluginId,P_EVENT.PAGE_COUNT,{
                src:link,
                pageCount:1,
                slideCount:maxNumberSlide
            });
       }
    })
    .then(function success(text) {             
        if(text.length>0){
            try {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(text,"text/xml");    
                var pages=xmlDoc.getElementsByTagName("Pages");
                var slides=xmlDoc.getElementsByTagName("Slides");
                var pageCount=1;
                var slideCount=1;
                if(pages.length>0){
                    pageCount=pages[0].firstChild.textContent;
                }
                if(slides.length>0){
                    slideCount=slides[0].firstChild.textContent;
                }

                nPlugin.sendData(pluginId,P_EVENT.PAGE_COUNT,{
                    src:link,
                    pageCount:pageCount,
                    slideCount:slideCount
                });
            } catch (error) {
                console.log(error);
            }
        }else{
            console.log("not find content docProps/app.xml");
        }
    }, function error(e) {
        console.log(e);
    });
}