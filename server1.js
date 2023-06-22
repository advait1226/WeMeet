var express = require('express');
var socket = require('socket.io');
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const authRoutes = require('./routes/authroutes');
const passportSetup= require('./config/passport-setup');
const keys= require('./config/keys');
var os = require('os');
const {v4 : uuidV4} = require('uuid');
const shortid = require('shortid');
const cookieSession= require('cookie-session');
const passport= require('passport');


// App setup
var app = express();
var server = http.Server(app);
//connect to mongodb //listen for requests
mongoose.connect(keys.mongoDB.dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=> {
    console.log('connected to mongodb');
    server.listen(4000, ()=>{
        console.log('app now listening for requests on port 4000')
    });
    
})
.catch((err)=> console.log(err) );



// var server = app.listen(4000, function(){
//     console.log('listening for requests on port 4000,');
// });

// Static files and middleware
app.use(express.static('public'));
app.use(morgan('dev')); 
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



//session cookie set up
app.use(cookieSession({ //encrypts cookie
    maxAge: 24*60*60*1000 , //milisecd for a day
    keys: [keys.session.cookieKey]
}));

// register regenerate & save after the cookieSession middleware initialization
//req.session.regenerate in v 0.5.3 but not in 0.6.0 so error that req.session.regenerate not a function
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => {
            cb();
        }
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => {
            cb();
        }
    }
    next();
});


//initialize passport
app.use(passport.initialize());
    app.use(passport.session()); // session cookies while login





app.get("/", (req, res)=>{
    res.render('login', { user: req.user});
  // res.send('dcdc');
});


// app.get("/meet", (req, res)=>{
//     res.render('mytry');
//   // res.send('dcdc');
// });

//auth routes
app.use('/auth', authRoutes);

// room routes
app.get("/create", (req, res)=>{
    res.redirect(`/${shortid.generate()}`);
});

app.get("/:room", (req, res)=>{
  res.render('mytry', {roomId : req.params.room});
});








// Socket setup & pass server

var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    


    //handle video events

    socket.on('join-room', (roomId, userId)=>{
        console.log(roomId, userId);

        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        // Handle chat event

    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    socket.on('typing', (data)=>{
        socket.broadcast.emit('typing', data)
    });
   
    //whiteboard handler

    socket.on('draw' , (data) =>{
                console.log("draw");
                socket.broadcast.emit('ondraw', {x : data.x, y: data.y});
          
    
    });
    
    
    socket.on('down', (data)=>{
        console.log("down");

    socket.broadcast.emit('ondown', {x : data.x, y: data.y});
        
    } );
        



   socket.on('disconnect', ()=>{
    socket.broadcast.to(roomId).emit('user-disconnected', userId);
   });
   
    });









});






















app.use((req, res) =>{
    res.status(404).render('404', {title : 'About'});
 }); 