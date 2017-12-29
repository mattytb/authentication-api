import mongoose from 'mongoose';
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
let claimSchema = Schema({
    clientId: {
        type:String,
        required:true
    },
    claimant :  { type: Schema.Types.ObjectId, ref: 'User' },
    token:{
        type: String
    },
    expires: { 
        type: Date
    }
});

module.exports = mongoose.model('Claim', claimSchema); 