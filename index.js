var os = require('os');
const morgan = require('morgan');
var express = require('express');
var app = express();
var http = require('http');
const server = http.Server(app);
var socket = require('socket.io');
const {v4 : uuidV4} = require('uuid');

server.listen(8000, ()=>{
    console.log('listening to requests on port 8000');
});
var io = socket(server);

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); 

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get("/", (req, res)=>{
      res.redirect(`/${uuidV4()}`);
    // res.send('dcdc');
  });

  app.get("/:room", (req, res)=>{
    res.render('room', {roomId : req.params.room});
});





  io.on('connection', socket =>{
    // console.log(`user ${socket.id} connected`, count);

    socket.on('join-room', (roomId, userId)=>{
        // console.log(roomId, userId);

        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
   

        
   socket.on('disconnect', ()=>{
    socket.broadcast.to(roomId).emit('user-disconnected', userId);
   });
   
    });


  });



