import mongoose from 'mongoose';
import config from '../config';
mongoose.Promise = Promise;
let userSchema = mongoose.Schema({
    name: {
        type:String, 
        required:true
    },
    password: {
        type: String
    },
    email : {
        type: String,
        required:true,
        unique:true
    },
    admin: {
        type:Boolean
    },
    created: { 
        type: Date,
        default: Date.now
    },
    image: String
});

module.exports = mongoose.model('User', userSchema);

