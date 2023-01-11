var pluginId="wiris";
var nPlugin=null;
var P_EVENT={
    EDIT:"EDIT",
    GET:"GET"
}
var editor;
var pluginData;
window.addEventListener("DOMContentLoaded",()=>{
    editor = com.wiris.jsEditor.JsEditor.newInstance({'language': 'en'});
    editor.insertInto(document.getElementById('editorContainer'));
    nPlugin=new notePlugin(pluginId);
    nPlugin.on(P_EVENT.EDIT,(data)=>{
        if(data 
            && typeof data.content =="string"
            && data.type
            && typeof data.type=="string"
            ){
                editMath(data);
            }
    })
    nPlugin.on(P_EVENT.GET,()=>{
        if(!pluginData) pluginData={type:"mathml"};
        var mathml=editor.getMathML();
        pluginData.content=mathml;
        nPlugin.sendData(pluginId,P_EVENT.GET,pluginData);
    })
})



function editMath(data){
    if(data.type=="mathml"){
            pluginData=JSON.parse(JSON.stringify(data));
            editor.setMathML(pluginData.content);
    }
}