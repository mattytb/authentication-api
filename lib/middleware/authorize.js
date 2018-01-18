import { verifyAuthorizationToken } from '../clients/tokenClient';
import { getAuthorizationTokenWithValidRefreshToken } from '../services/claimService';
import { logError } from '../clients/errorLogClient';

export function authorize(req, res, next){
    
    let authorizationToken,
        authorizationHeaderValue,
        refreshToken = req.body.refreshToken || req.query.refreshToken,
        authorizationHeader = req.headers.authorization;

    if(authorizationHeader){
        authorizationHeaderValue = authorizationHeader.split(' ');
        authorizationToken = authorizationHeaderValue[1]
    };

    const noTokensError = new Error("Unauthorized");
    noTokensError.status = 401;

    if(!authorizationToken && !refreshToken) {
        res.jsonError(noTokensError, res);
    }
    else {
        if(refreshToken){
            console.log(refreshToken);
            getAuthorizationTokenWithValidRefreshToken(refreshToken).then(newToken => {
                res.locals.authorizationToken = `Bearer ${newToken}`;
                next();
            })
            .catch(err => res.jsonError(err));
        }
        else {
            verifyAuthorizationToken(authorizationToken).then(result => {
                res.locals.authorizationToken = `Bearer ${authorizationToken}`;
                next();
            })
            .catch(err => res.jsonError(err));
        }
    }
}