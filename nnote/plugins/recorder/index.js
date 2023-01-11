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
var recordType="video";
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

    recordType=query.recordType;
    if(!recordType) recordType="video";

    var options = {
    controls: true,
    width: (recordType=="screen")? 800:320,
    height: (recordType=="screen")? 450:240,
    fluid: false,
    bigPlayButton: false,
    controlBar: {
        volumePanel: false
    },
   
    plugins: {
        wavesurfer: {
            backend: 'WebAudio',
            waveColor: '#6fffe9',
            progressColor: 'black',
            displayMilliseconds: true,
            debug: true,
            cursorWidth: 1,
            hideScrollbar: true,
            plugins: [
                // enable microphone plugin
                WaveSurfer.microphone.create({
                    bufferSize: 4096,
                    numberOfInputChannels: 1,
                    numberOfOutputChannels: 1,
                    constraints: {
                        video: false,
                        audio: true
                    }
                })
            ]
        },
        record: {
                    audio: true,
                    video: (recordType=="video")? true:false,
                    screen:(recordType=="screen")? true:false,
                    maxLength: 600,
                    debug: true,
                    displayMilliseconds: false,
                    videoMimeType:"video/webm;codecs=h264",
                    videoRecorderType:"MediaStreamRecorder",
                }
        }
    };

    // apply some workarounds for opera browser
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
        },1000);
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