import mongoose from 'mongoose';
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
let errorLogSchema = Schema({
    message:{
        type:String,
        required:true
    },
    status:{
        type:Number
    },
    code:{
        type:String
    },
    stack:{
        type:String
    },
    errno:{
        type:String
    },
    path:{
        type:String
    },
    address:{
        type:String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ErrorLog', errorLogSchema); 