const socket = io('/');
const videoGrid = document.getElementById('video-grid');
var vc;
var myPeer = new Peer(undefined, {
    host: '/',
    port: '4001'
})
//undefined because we let peerjs choose userid for us

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {};
navigator.mediaDevices.getUserMedia(
    {
        video : true,
        audio: true
    }).then( stream => {
        addVideoStream(myVideo, stream)

        myPeer.on('call', call =>{
            call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
        // document.location.reload();

  })
  call.on('close', ()=>{
        video.remove()
  })
            
        
        })

        socket.on('user-connected', userId =>{
            console.log(userId, "connected");
            connectToNewUser(userId, stream);
        })
    })

    socket.on('user-disconnected', userId =>{
        console.log(userId, "disconnected");
        if(peers[userId]) peers[userId].close()
    })

    
    



myPeer.on('open', id => { 
    socket.emit('join-room', ROOM_ID, id);
});
// as soon as we connect to peer server and get back id

function connectToNewUser(userId, stream)
{
        const call = myPeer.call(userId, stream); //calling user with userId and sending them ourt video stream
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{  //when we receive a video stream
                addVideoStream(video, userVideoStream)
                // document.location.reload();

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