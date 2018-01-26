import { getClaimByRefreshToken } from '../clients/claimClient';
import { isISODateLessThanDateTimeNow } from '../modules/dateHelper';
import { applyAuthorizationToken } from '../services/authorizationTokenService';

export function provideCompleteClaim(claim, user){
    return {
        userId:user._id,
        userImage:user.image,
        authorizationToken:claim.authorizationToken,
        name:user.name,
        refreshToken:claim.refreshToken
    }
}

export function getAuthorizationTokenWithValidRefreshToken(refreshToken){
   return new Promise((resolve, reject) => {

        var error = new Error();
        error.message = "Unauthorised";
        error.status = 401;

        getClaimByRefreshToken(refreshToken).then(claim => {
            if(claim){
                var claimHasExpired = isISODateLessThanDateTimeNow(claim.expires);
                if(claimHasExpired) {
                    reject(error);
                }
                else {
                    applyAuthorizationToken(claim).then(refreshedClaim => {
                        resolve(refreshedClaim.authorizationToken);
                    })
                    .catch(err => reject(err));
                }
            }
            else {
                reject(error);
            }
        }).catch(err => reject(err));
    });
}