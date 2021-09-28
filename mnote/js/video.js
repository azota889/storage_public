var OV;						// OpenVidu object to initialize a session
var session;				// Session object where the user will connect
var publisher;				// Publisher object which the user will publish
var sessionId;				// Unique identifier of the session
var audioEnabled = true;	// True if the audio track of publisher is active
var videoEnabled = true;	// True if the video track of publisher is active
var numOfVideos = 0;		// Keeps track of the number of videos that are being shown
// Disconnect participant on browser's window closed
window.addEventListener('beforeunload', function () {
	if (session) session.disconnect();
});
// --- 1) Get an OpenVidu object ---



function vi_joinRoom(sessionId,usid) {

	if (!sessionId || !usid) {
		// If the user is joining to a new room
        //sessionId = randomString();
        return;
	}

	
	OV = new OpenVidu();

	// --- 2) Init a session ---

	session = OV.initSession();


	// --- 3) Specify the actions when events take place in the session ---

	// On every new Stream received...
	session.on('streamCreated', function (event) {
		//try{
			cc.log("on stream create "+JSON.parse(event.stream.connection.data).usid+":"+Gl.hostinfo.id);
			var usid=JSON.parse(event.stream.connection.data).usid;
			if(usid==Gl.hostinfo.id){
				cc.log("host recevi");
				Gl.HostBoard.receiveStream(event);
			}else{
				cc.log("usupboard recevi");
				Gl.UserUpBoard.addUserStream(usid,event)
			}
		//}catch(e){
		//	console.log("error create stream "+e.toString());
		//}
	});

	// On every new Stream destroyed...
	session.on('streamDestroyed', function (event) {
		// Update the page layout
		//numOfVideos--;
		//updateLayout();
		try{
			cc.log("on stream destroy "+JSON.parse(event.stream.connection.data).usid);
			var usid=JSON.parse(event.stream.connection.data).usid;
			if(usid==Gl.hostinfo.id){
				Gl.HostBoard.removeStream(event);
			}else{
				Gl.UserUpBoard.removeUser(usid,event)
			}
			//var usid=JSON.parse(event.stream.connection.data).usid;
			//Gl.BoardMedia.addMedia(usid,event.stream);
		}catch(e){
			
		}
	});


	// --- 4) Connect to the session with a valid user token ---

	// 'getToken' method is simulating what your server-side should do.
	// 'token' parameter should be retrieved and returned by your own backend
	getToken(sessionId).then(token => {
        cc.log("on get token "+JSON.stringify(token));
		// Connect with the token
		session.connect(token,{usid:usid})
			.then(() => {
				cc.log("connect success to openvidu");
				if(Gl.usinfo.isHost) Gl.MyBoard.startPublish();		
			})
			.catch(error => {
				console.log('There was an error connecting to the session:', error.code, error.message);
			});
	});
}

function startPublish(){
	// --- 5) Set page layout for active call ---

	var videostream = document.getElementById('canvas_stream').captureStream(15);
	var audioTrack=undefined;
	if(Gl.BoardMedia.stream.getAudioTracks().length>0){
		audioTrack=Gl.BoardMedia.stream.getAudioTracks()[0];
	}

	// --- 6) Get your own camera stream with the desired properties ---

	publisher = OV.initPublisher('usVideo_'+usid, {
		audioSource: null, // The source of audio. If undefined default audio input
		videoSource: videostream.getVideoTracks()[0], // The source of video. If undefined default video input
		publishAudio: false,  	// Whether to start publishing with your audio unmuted or not
		publishVideo: true,  	// Whether to start publishing with your video enabled or not
		resolution: Gl.BoardMedia.streamWidth+'x'+Gl.BoardMedia.streamHeight,  // The resolution of your video
		frameRate: 15,			// The frame rate of your video
		insertMode: 'PREPEND',	// How the video is inserted in target element 'video-container'
		mirror: false       		// Whether to mirror your local video or not
	});

	if(Gl.classinfo && Gl.classinfo.hostkey!=""){
		console.log("publish stream");
		session.publish(publisher);
		Gl.BoardMedia.addMedia(Gl.usinfo.id,null);  
	}
}

function vi_leaveRoom() {

	// --- 9) Leave the session by calling 'disconnect' method over the Session object ---
	if(session) session.disconnect();
}

var OPENVIDU_SERVER_URL = "https://wiki.cafeb.vn:4443";
var OPENVIDU_SERVER_SECRET = "123456@";

function getToken(mySessionId) {
	return createSession(mySessionId).then(sId => createToken(sId));
}

function createSession(sId) { // See https://openvidu.io/docs/reference-docs/REST-API/#post-apisessions
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "POST",
			url: OPENVIDU_SERVER_URL + "/api/sessions",
			data: JSON.stringify({ customSessionId: sId }),
			headers: {
				"Authorization": "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
				"Content-Type": "application/json"
			},
			success: response => resolve(response.id),
			error: (error) => {
				if (error.status === 409) {
					resolve(sId);
				} else {
					console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + OPENVIDU_SERVER_URL);
					if (window.confirm('No connection to OpenVidu Server. This may be a certificate error at \"' + OPENVIDU_SERVER_URL + '\"\n\nClick OK to navigate and accept it. ' +
						'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' + OPENVIDU_SERVER_URL + '"')) {
						location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
					}
				}
			}
		});
	});
}

function createToken(sId) { // See https://openvidu.io/docs/reference-docs/REST-API/#post-apitokens
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "POST",
			url: OPENVIDU_SERVER_URL + "/api/tokens",
			data: JSON.stringify({ session: sId }),
			headers: {
				"Authorization": "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
				"Content-Type": "application/json"
			},
			success: response => resolve(response.token),
			error: error => reject(error)
		});
	});
}