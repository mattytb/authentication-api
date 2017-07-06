import mongoose from 'mongoose';
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
    created: { type: Date},
    token: String
});

module.exports = mongoose.model('User', userSchema);

