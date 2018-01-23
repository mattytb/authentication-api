export function stripOutBearerToJustAuthorizationToken(authorizationTokenWithBearer){
    const splitAuthorizationToken = authorizationTokenWithBearer.split(' '),
        justAuthorizationToken = splitAuthorizationToken[1];
        return justAuthorizationToken;
}