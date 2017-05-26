import mongoose from 'mongoose';
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({ 
    name: {
    	type:String, 
    	required:true
    },
    password: {
    	type: String, 
    	required:true
    },
    email : {
        type: String,
        required:true
    },
    admin: {
        type:Boolean
    },
    created: { type: Date},
    token: String
}));