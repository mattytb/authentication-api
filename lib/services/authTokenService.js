import { saveTokenToClaim } from '../clients/claimClient';
import { getToken } from '../clients/tokenClient';

export function applyAuthToken(claim){
	return new Promise((resolve, reject) => {
		const token = getToken({claimantId:claim.claimant, clientId:claim.clientId});
		saveTokenToClaim(claim._id, token)
			.then(claim => resolve(claim))
			.catch(err => reject(err));
	});
}