import { verifyAuthorizationToken } from '../clients/tokenClient';
import { getAuthorizationTokenWithValidRefreshToken } from '../services/claimService';
import { stripOutBearerToJustAuthorizationToken } from '../modules/authorizationTokenHelper'

export function authorize(req, res, next){

    const noTokensError = new Error("Unauthorized"),
        refreshToken = req.body.refreshToken || req.query.refreshToken,
        authorizationHeader = req.headers.authorization;

    let authorizationToken;

    noTokensError.status = 401;

    if(authorizationHeader) authorizationToken = stripOutBearerToJustAuthorizationToken(authorizationHeader);

    if(!authorizationToken && !refreshToken) {
        res.jsonError(noTokensError, res);
    }
    else {
        if(refreshToken){
            getAuthorizationTokenWithValidRefreshToken(refreshToken).then(newAuthorizationToken => {
                res.locals.authorizationToken = `Bearer ${newAuthorizationToken}`;
                next();
            })
            .catch(err => res.jsonError(err, res));
        }
        else {
            verifyAuthorizationToken(authorizationToken).then(result => {
                res.locals.authorizationToken = `Bearer ${authorizationToken}`;
                next();
            })
            .catch(err => res.jsonError(err, res));
        }
    }
}