const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema= new Schema({
    username: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: true
    },
    thumbnail:{
        type: String
    }
}, {timestamps: true});

const User  = mongoose.model('User', userSchema);
// automatically looks for blogs collection, pluralizes it
module.exports= User;