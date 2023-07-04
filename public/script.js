const socket = io('/');

const videoGrid = document.getElementById('video-grid');

var myPeer = new Peer(undefined, {
    host: '/',
    port: '4001',
    iceServers: [
            {
              urls: "stun:stun.relay.metered.ca:80",
            },
            {
              urls: "turn:a.relay.metered.ca:80",
              username: "8776eeea3fab7a55c4c1e8e3",
              credential: "nzBrP8BgSMLy17A6",
            },
            {
              urls: "turn:a.relay.metered.ca:80?transport=tcp",
              username: "8776eeea3fab7a55c4c1e8e3",
              credential: "nzBrP8BgSMLy17A6",
            },
            {
              urls: "turn:a.relay.metered.ca:443",
              username: "8776eeea3fab7a55c4c1e8e3",
              credential: "nzBrP8BgSMLy17A6",
            },
            {
              urls: "turn:a.relay.metered.ca:443?transport=tcp",
              username: "8776eeea3fab7a55c4c1e8e3",
              credential: "nzBrP8BgSMLy17A6",
            },
        ],
      }
)
//undefined because we let peerjs choose userid for us
var screenSharing = false;
const myVideo = document.createElement('video');
var mystream;
var myscreen;
myVideo.muted = true
const peers = {};
var gum = navigator.mediaDevices.getUserMedia;


myPeer.on('open', id => { 
    socket.emit('join-room', ROOM_ID, id);
    gum(
        {
            video : true,
            audio: true
        }).then( stream => {
            mystream = stream;
            addVideoStream(myVideo, stream)
        });
});

        myPeer.on('call', call =>{
            peers[call.peer] = call;
            call.answer(mystream);
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
            })
            call.on('close', ()=>{
            video.remove() });
            
        });

        socket.on('user-connected', userId =>{
            console.log(userId, "connected");
            connectToNewUser(userId, mystream);
        });
        
        socket.on('user-disconnected', userId =>{
            console.log(userId, "disconnected");
            if(peers[userId]) peers[userId].close()
        });




function connectToNewUser(userId, stream)
{
    const call = myPeer.call(userId, stream); //calling user with userId and sending them ourt video stream
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{  //when we receive a video stream
        addVideoStream(video, userVideoStream)
    })
    call.on('close', ()=>{
        video.remove()
    })

    peers[userId] = call
}


function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video);
}


const muteUnmute = () => {
    const enabled = mystream.getAudioTracks()[0].enabled;
    if (enabled) {
        mystream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        mystream.getAudioTracks()[0].enabled = true;
    }
}

const playStop = () => {
console.log('object')
let enabled = mystream.getVideoTracks()[0].enabled;
if (enabled) {
    mystream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
} else {
    setStopVideo()
    mystream.getVideoTracks()[0].enabled = true;
}
}

const setMuteButton = () => {
const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
`
document.getElementById('mute').innerHTML = html;
}

const setUnmuteButton = () => {
const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
`
document.getElementById('mute').innerHTML = html;
}

const setStopVideo = () => {
const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
`
document.getElementById('video_button').innerHTML = html;
}

const setPlayVideo = () => {
const html = `
<i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
`
document.getElementById('video_button').innerHTML = html;
}

function startScreenShare() {
    if (screenSharing) {
        
        // var element = document.getElementById('share');
        // element.parentNode.removeChild(element);
        stopScreenSharing()
    }
    else{
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        myscreen = stream;
        // const v = document.createElement('video')
        // v.setAttribute("id", "share");
        
        let videoTrack = myscreen.getVideoTracks()[0];
        // addVideoStream(v, myscreen)
        videoTrack.onended = () => {
            stopScreenSharing()
        }
        if (myPeer) {
            for (const key in peers) {
                let fren = peers[key];
                // Use `key` and `value`
            
            let sender = fren.peerConnection.getSenders().find((s)=> {
                return s.track.kind == videoTrack.kind;
            })
            sender.replaceTrack(videoTrack)
        }
            screenSharing = true;
        }
        // console.log(screenStream)
    })
}
}

function stopScreenSharing() {
    if (!screenSharing) return;
    let videoTrack = mystream.getVideoTracks()[0];
    if (myPeer) {
        for (const key in peers) {
            let fren = peers[key];

        let sender = fren.peerConnection.getSenders().find((s)=> {
            return s.track.kind == videoTrack.kind;
        })
        sender.replaceTrack(videoTrack)
    }
    myscreen.getTracks().forEach(function (track) {
        track.stop();
    });
}
    screenSharing = false
}

