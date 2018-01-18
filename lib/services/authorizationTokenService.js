import { saveAuthorizationTokenToClaim } from '../clients/claimClient';
import { getAuthorizationToken } from '../clients/tokenClient';

export function applyAuthorizationToken(claim){
	return new Promise((resolve, reject) => {
		const authorizationToken = getAuthorizationToken({claimantId:claim.claimant, clientId:claim.clientId});
		saveAuthorizationTokenToClaim(claim._id, authorizationToken)
			.then(claim => resolve(claim))
			.catch(err => reject(err));
	});
}