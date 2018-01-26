import * as UserClient from '../clients/userClient';
import { getFacebookUser } from '../clients/facebookClient';
import { saveNewClaim, deleteClaimByClaimantAndClientId } from '../clients/claimClient';
import { provideCompleteClaim } from './claimService';
import { applyAuthorizationToken } from './authorizationTokenService';

function _saveClaim(clientId, user, expires) {
	return new Promise((resolve, reject) => {
		saveNewClaim(clientId, user._id, expires).then(
			newClaim => {
				applyAuthorizationToken(newClaim)
				.then(authorizedClaim => {
					resolve(
						provideCompleteClaim(authorizedClaim, user)
					)
					.catch(err => reject(err));
				}).catch(err => reject(err));
			}
		).catch(err => reject(err));
	});
}

export function authorizeNewUser(name, password, email, clientId, expires){

	let error = new Error("A user already exists with this email");
		error.status = 409;
		
	return new Promise((resolve, reject) => {
		UserClient.getUserByEmail(email).then(user => {
			reject(error);
		})
		.catch(err => {
			UserClient.saveNewUser(name, password, email).then(newUser => {
				_saveClaim(clientId, newUser, expires)
				.then(claim => resolve(claim))
				.catch(err => reject(new Error("unable to save claim")));
			})
	    	.catch(err => reject(err));
		});
	});
}

export function authorizeUser(email, password, clientId, expires){
	return new Promise((resolve, reject) => {
		UserClient.getUserByEmailAndPassword(email, password).then(user => {
			deleteClaimByClaimantAndClientId(user._id, clientId).then(result => {
				_saveClaim(clientId, user, expires)
				.then(claim => resolve(claim))
				.catch(err => reject(new Error("unable to save claim")));
			})
			.catch(err => reject(err));
		})
		.catch(err => reject(err));
	});
}

export function authorizeFacebookUser(accessToken, clientId, expires){
	return new Promise((resolve, reject) => {
		getFacebookUser(accessToken, clientId).then(user => {
			UserClient.getUserByEmail(user.email).then(user => {
				deleteClaimByClaimantAndClientId(user._id, clientId).then(result => {
					_saveClaim(clientId, user, expires)
					.then(claim => resolve(claim))
					.catch(err => reject(new Error("unable to save claim")));
				})
				.catch(err => reject(err));
			})
			.catch(err => {
				UserClient.saveThirdPartyUser(user.name, user.email, user.picture.data.url).then(newUser => {
					_saveClaim(clientId, newUser, expires)
					.then(claim => resolve(claim))
					.catch(err => reject(err));
		    	})
	    		.catch(err => reject(err));
			});
		})
		.catch(err => reject(err));
	});
}