const express= require('express');
// const authController= require('../controllers/blogcontroller')
const router = express.Router();
const passport = require('passport'); 
const User = require('../models/user');

//auth login



//logout
router.get('/logout', (req, res)=>{
    User.deleteOne({_id: req.user.id});
    req.logout((result)=>{
    res.redirect('/');

    })
});

// auth with google

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));// bring up consent screen


//callback route for google
 router.get('/google/redirect', passport.authenticate('google'), (req,res)=>{
    // res.send(req.user);
    res.redirect('/');
 }) //sees code requests info fires passport callback

module.exports = router;
