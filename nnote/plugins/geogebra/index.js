var pluginId="geobebra";
var nPlugin=null;
var P_EVENT={
    GET:"GET"
}
var pluginApi;
var geogebraType;
window.addEventListener("DOMContentLoaded",()=>{
    nPlugin=new notePlugin(pluginId);
    nPlugin.on(P_EVENT.GET,()=>{
        if(pluginApi){
            if(geogebraType=="bbt"){
                var base64= pluginApi.getPNGBase64(1.5, true);
                getPNG_BBT(base64,(png,width,height)=>{
                    nPlugin.sendData(pluginId,P_EVENT.GET,{
                        content:png,
                        type:"image/png",
                        width:width,
                        height:height
                    });
                })
            }else{
                pluginApi.exportSVG((svg)=>{
                    nPlugin.sendData(pluginId,P_EVENT.GET,{
                        content:svg,
                        type:"image/svg+xml"
                    });
                }); 
            }
            
        }
    })
    var query = nPlugin.getQueryParams(document.location.search);
    geogebraType=query.geogebraType;
    if(!geogebraType) geogebraType="graphing";

    var params
    if(geogebraType=="bbt"){
        params= {"appName": "classic","filename":"bbt_dt.ggb","width": window.innerWidth, "height": window.innerHeight, "showToolBar": false, "showAlgebraInput": true, "showMenuBar": false,appletOnLoad:(api)=>{
            pluginApi=api
        }};
    }else{
        params = {"appName": geogebraType,"width": window.innerWidth, "height": window.innerHeight, "showToolBar": false, "showAlgebraInput": true, "showMenuBar": false,appletOnLoad:(api)=>{
            pluginApi=api
        }};
    }
    
    var applet = new GGBApplet(params, true);
    applet.inject('ggb-element');

    setTimeout(()=>{
       var base64= pluginApi.getPNGBase64(1, true);
       console.log(base64);
       var img=new Image();
       img.src="data:image/png;base64,"+base64;
       document.body.appendChild(img);
       img.style.position="absolute";
    },10000);
})

function getPNG_BBT(base64,func){
    var img=new Image();
    img.onload=()=>{
         var cv=document.createElement("canvas");
         cv.width=700*1.5;
         cv.height=260*1.5;
         var ctx=cv.getContext("2d");
         ctx.drawImage(img,5,5,cv.width,cv.height,0,0,cv.width,cv.height);
         func(cv.toDataURL("image/png"),cv.width,cv.height);
    }
    img.src="data:image/png;base64,"+base64;
    //document.body.appendChild(img);
}