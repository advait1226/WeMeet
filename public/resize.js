 const videoContainer = document.getElementById("video-grid");

function resizeVideos() {
    console.log("tgbtb");
 var cont = document.getElementById('video-grid'); 
 var a =    document.querySelectorAll('video-grid');

 var len = a.length;

  const containerWidth = cont.offsetWidth * 0.8;
  const containerHeight = cont.offsetHeight * 0.8;
  for (var i = 0; i < len; i++) {
    //work with checkboxes[i]
// }
//   a.forEach( (index, element) =>{
  a[i].style.width = `${containerWidth / len}`;
  a[i].style.height = `${containerHeight / len}`;
};}
//   const aspectRatio1 = video1.videoWidth / video1.videoHeight;
//   const aspectRatio2 = video2.videoWidth / video2.videoHeight;

//   if (containerWidth / aspectRatio1 < containerHeight) {
//     video1.style.width = '100%';
//     video1.style.height = 'auto';
//     video2.style.width = `${containerWidth / aspectRatio1}px`;
//     video2.style.height = `${containerWidth / aspectRatio1}px`;
//   } else {
//     video1.style.width = `${containerHeight * aspectRatio1}px`;
//     video1.style.height = `${containerHeight}px`;
//     video2.style.width = '100%';
//     video2.style.height = 'auto';
//   }


window.addEventListener('resize', resizeVideos);
// videoContainer.addEventListener('change', resizeVideos);
    
// select the target node
// var target = document.querySelector('#some-id');

// videoContainer.addEventListener("DOMNodeInserted", function (e) {
//     e.target // 
// }, false);

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };

// create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    // if (mutation.type === "childList") {
    resizeVideos();
    // }
  });    
});



// pass in the target node, as well as the observer options
observer.observe(videoContainer, config);

// later, you can stop observing
observer.disconnect();

