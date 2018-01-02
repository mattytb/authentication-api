import Claim from '../claim';

export function provideNewClaim(clientId, userId, expires){
	var claim = new Claim({ 
        clientId:clientId,
        claimant:userId,
        expires:expires
	});
	return claim;
}