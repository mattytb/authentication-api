import { provideNewClaim } from '../models/providers/newClaimProvider';
import { saveClaim } from '../models/utils/claimUtils'
import Claim from '../models/claim';
import { logError } from '../clients/errorLogClient';


export function saveNewClaim(clientId, userId, expires){
    return new Promise((resolve, reject) => {
        let claim = provideNewClaim(clientId, userId, expires);
        saveClaim(claim)
            .then(claim => resolve(claim))
            .catch(err => reject(err)
        );
    }).catch(err => reject(err));
}

export function saveAuthorizationTokenToClaim(claimId, authorizationToken){
    return new Promise((resolve, reject) => {
        Claim.findById(claimId).then(claim => {
            claim.authorizationToken = authorizationToken;
            claim.save();
            resolve(claim);
        })
        .catch(err => reject(err));
    });
}

export function deleteClaimByClaimantAndClientId(claimantId, clientId){
    return new Promise((resolve, reject) => {
        Claim.findOneAndRemove({claimant:claimantId, clientId:clientId})
        .then(result => resolve(true))
        .catch(err => {
            reject(err);
        });
    });
}

export function getClaimByRefreshToken(refreshToken){
    return new Promise((resolve, reject) => {
        Claim.findOne({refreshToken:refreshToken})
        .then(claim => resolve(claim))
        .catch(err => {
            reject(err);
        });
    });
} 

export function getUserByAuthorizationToken(authorizationToken){
    return new Promise((resolve, reject) => {
        Claim.findOne({authorizationToken:authorizationToken})
        .populate({path:'claimant'})
        .then(
            claimWithUser => {
                resolve(claimWithUser.claimant);
            } 
        )
        .catch(err => reject(err));
    });
}
