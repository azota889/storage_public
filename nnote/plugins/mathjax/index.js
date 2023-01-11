var pluginId="mathjax";
var nPlugin=null;
var P_EVENT={
    START_LOAD:"start_load",
    MATHML_SVG:"mathml_svg"
}
var editor;
window.addEventListener("DOMContentLoaded",()=>{
    nPlugin=new notePlugin(pluginId);
    nPlugin.on(P_EVENT.MATHML_SVG,(data)=>{
        if(data 
            && data.content
            && typeof data.content =="string"
            ){
                mathml2Svg(data.content);
            }
    })
})

function mathml2Svg(mathml){
    var svg=MathJax.mathml2svg(mathml);
    if(svg && svg.firstChild){
        var msvg=svg.firstChild;
        msvg.style.transformOrigin="0% 0%";
        msvg.style.transform="scale(2)";
        document.getElementById("output").appendChild(msvg);
    }
    
}

