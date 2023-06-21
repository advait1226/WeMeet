let canvas = document.getElementById('canvas');
// canvas.width = '350px';
// canvas.height = '400px';

// const socket = io('/');

// var socket = io.connect('http://localhost:8080')

let ctx = canvas.getContext("2d");

// ctx.moveTo(100, 100);
// ctx.lineTo(200, 200);
// ctx.stroke();
let x;
let y;
let mouseDown =  false;

// process.setMaxListeners(0);

canvas.onmousedown = (e) =>{
    console.log(mouseDown);
    ctx.moveTo(x, y);
    mouseDown = true;
    // socket.emit('down', {x , y});

};

window.onmouseup = (e) =>{
    mouseDown = false;
    // socket.emit('down', {x , y});

};

socket.on('ondraw', ({x , y})=>{
    ctx.lineTo(x , y);
    ctx.stroke();
} );

socket.on('ondown', ({x , y})=>{
    ctx.moveTo(x, y);
} );




    window.onmousemove = function(e) {

        var pos = getMousePos(canvas, e), /// provide this canvas and event
            x = pos.x,
            y = pos.y;
    
        /// check x and y against the grid
    
    
    /// the main function
    // x = e.clientX;
    // y = e.clientY;
    if(mouseDown){
        // console.log(x, y);
    // socket.emit('draw', {x , y});
    ctx.lineTo(x , y);
    ctx.stroke();
    }
};



// function getMousePos(canvas, e) {
    
//     /// getBoundingClientRect is supported in most browsers and gives you
//     /// the absolute geometry of an element
//     var rect = canvas.getBoundingClientRect();

//     /// as mouse event coords are relative to document you need to
//     /// subtract the element's left and top position:
//     return {x: e.clientX - rect.left, y: e.clientY - rect.top};
// }


function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }
