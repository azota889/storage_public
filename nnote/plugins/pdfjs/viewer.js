var pageWidth=0;
var pageHeight=0;
var currPage=0;
var pluginId="pdfjs";
var nPlugin=null;
var pageHeights=[];
var pdfDocument=null;

var viewPortScale=1;

var P_EVENT={
    START_LOAD:"start_load",
    FINISH_RENDER:"finish_render"
}

function reset(){
    //remove all div page 
    var divViewer=document.getElementById("pdfviewer")
    while(divViewer.childNodes.length>0){
        divViewer.removeChild(divViewer.firstChild);
    }
    totalPage=0;
    pageWidth=0;
    pageHeight=[];
    pdfDocument=null;

}

function loadPdf(link,width){
    pageWidth=width;
    nPlugin.sendData(pluginId,P_EVENT.START_LOAD,{
       link:link,
       width:width
    })
    const LoadFilePdf = pdfjsLib.getDocument({ url: link, fontExtraProperties: true, useSystemFonts: true });
    LoadFilePdf.promise.then((pdf) => {
        pdfDocument=pdf;
        processPage(1);
    }).catch(e=>{
        //console.log("Error pdfjs load file "+link);
        reset();
    });
}

function processPage(pageNumber){
    if(isNaN(pageNumber) || pageNumber<=0) {
        //strange things
        return;
    };
    //process all done
    if(pageNumber>pdfDocument.numPages){
        //console.log("finish parse all page ");
        var ob={
            totalPage:pdfDocument.numPages,
            pageWidth:pageWidth,
            pageHeight:pageHeight,
            pageHeights:pageHeights.concat([])
        }
        //console.log(ob);
        nPlugin.sendData(pluginId,P_EVENT.FINISH_RENDER,ob);
        return;
    }

    currPage=pageNumber;
    //get page svg , canvas to parse 
    //console.log("process page "+pageNumber);
    pdfDocument.getPage(pageNumber).then((page) => {
        //calculate scale 
        var viewport;
        if(pageNumber==1){
             viewport= page.getViewport({ scale:1});
             viewPortScale=(pageWidth>0)? pageWidth/viewport.width:1;  
             //console.log('scale : '+viewPortScale);
        }

        viewport=page.getViewport({scale:viewPortScale})
        
        var cv=document.createElement("canvas");
        cv.width=2*viewport.width;
        cv.height=2*viewport.height;
        cv.style.width=Math.floor(viewport.width)+"px";
        cv.style.height=Math.floor(viewport.height)+'px';
        document.getElementById("pdfviewer").appendChild(cv);
        pageHeights.push(cv.height);
        pageHeight+=cv.height;
        page.render({canvasContext: cv.getContext("2d"), viewport: page.getViewport({scale:2*viewPortScale})}).promise.then(()=>{
            processPage(pageNumber+1);
        }).catch(e=>{
            //console.log("Error page "+pageNumber);
            processPage(pageNumber+1);   
        })
        
    }).catch(e=>{
        //console.log("Error parse page "+pageNumber);
        //console.log(e);
        processPage(pageNumber+1);
    })
}

window.addEventListener("DOMContentLoaded",()=>{
    nPlugin=new notePlugin(pluginId);
    nPlugin.on(P_EVENT.START_LOAD,(data)=>{
        if(data 
        && data.link 
        && data.width
        && typeof data.link =="string"
        && typeof data.width=="number"
        && data.width>0
        ){
             loadPdf(data.link,data.width);
        }
    })
    //loadPdf("https://wewiin.nyc3.cdn.digitaloceanspaces.com/homework/m12_2022/d06/1/bd24f33872ce99b363595a124046f834_4b74ba7a2be74d6caa1e92fd85ceb4741670314010.pdf",1000);

    var query = nPlugin.getQueryParams(document.location.search);
    if(query.url){
        var width=query.width;
        width=(!width || isNaN(width))? 1000:parseInt(width)
        loadPdf(query.url,width);
    }
})



