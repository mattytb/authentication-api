import mongoose from 'mongoose';
import randToken from 'rand-token'
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
let claimSchema = Schema({
    clientId: {
        type:String,
        required:true
    },
    claimant :  { type: Schema.Types.ObjectId, ref: 'User' },
    authorizationToken:{
        type: String
    },
    expires: { 
        type: Date
    },
    refreshToken:{
        type:String,
        default: function() {
            return randToken.generate(64);
        }
    }
});

module.exports = mongoose.model('Claim', claimSchema); 