var pluginId="recorder";
var nPlugin=null;
var P_EVENT={
    GET:"GET"
}
var pluginData;
var player
var ffmpeg = null;
var isRecording=false;
var needSendDataAfterStop=false;
const { createFFmpeg, fetchFile } = FFmpeg;
window.addEventListener("DOMContentLoaded",()=>{
    nPlugin=new notePlugin(pluginId);
    var query = nPlugin.getQueryParams(document.location.search);
    nPlugin.on(P_EVENT.GET,()=>{
        if(isRecording){
            needSendDataAfterStop=true;
            player.record().stop();
        }else{
            nPlugin.sendData(pluginId,P_EVENT.GET,{
                content:pluginData,
            });
        }
        
    })

    if (ffmpeg === null) {
    ffmpeg = createFFmpeg({ log: true,
        mainName: 'main',
        corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js', });
    }
    if (!ffmpeg.isLoaded()) {
         ffmpeg.load();
      }

      var options = {
        controls: true,
        width: 800,
        height: 450,
        fluid: false,
        bigPlayButton: false,
        controlBar: {
            volumePanel: false,
            fullscreenToggle: false
        },
        plugins: {
            record: {
                audio: true,
                screen: true,
                debug: true,
                displayMilliseconds: false,
                maxLength: 600,
                videoMimeType:"video/webm;codecs=h264",
                videoRecorderType:"MediaStreamRecorder",
            }
        }
    };
    
    applyScreenWorkaround();
    applyVideoWorkaround();

    player = videojs('myVideo', options, function() {
        // print version information at startup
        videojs.log('Using video.js', videojs.VERSION,
            'with videojs-record', videojs.getPluginVersion('record'),
            'and recordrtc', RecordRTC.version);
    });
    // error handling
    player.on('deviceError', function() {
        console.log('device error:', player.deviceErrorCode);
    });
    player.on('error', function(element, error) {
        console.error(error);
    });

    player.on("deviceReady",function(){
        setTimeout(()=>{
            player.record().start();
        },2000);
    })
    // user clicked the record button and started recording
    player.on('startRecord', function() {
        console.log('started recording!');
        isRecording=true;
        needSendDataAfterStop=false;
    });

    // user completed recording and stream is available
    player.on('finishRecord', async function() {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.
          console.log('finished recording: ', player.recordedData);
          transcode(URL.createObjectURL(player.recordedData));
          isRecording=false;
    });
})

async function transcode(url){
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      ffmpeg.FS('writeFile', "recorder.mkv", await fetchFile(url));
      
      await ffmpeg.run('-i', "recorder.mkv", '-c:v','copy', 'output.mp4');
      const data = ffmpeg.FS('readFile', 'output.mp4');
      pluginData=data;

      if(needSendDataAfterStop){
            nPlugin.sendData(pluginId,P_EVENT.GET,{
                content:pluginData,
            });
      }
}