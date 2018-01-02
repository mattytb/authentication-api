import { saveWebTokenToUser, saveNewUser, getUserByEmail, getUserByEmailAndPassword, saveThirdPartyUser } from '../clients/userClient';
import { getFacebookUser } from '../clients/facebookClient';
import { applyAuthToken } from './authTokenService';
import { verifyToken } from '../clients/tokenClient';
import { saveNewClaim } from '../clients/claimClient';
import { createCompleteClaim } from './claimService';

export function authenticateNewUser(name, password, email, clientId, expires = null){
	return new Promise((resolve, reject) => {
		getUserByEmail(email).then(user => {
			reject(new Error("A user already exists with this email"))
		})
		.catch(err => {
			saveNewUser(name, password, email).then(newUser => {
				saveNewClaim(clientId, newUser._id, expires).then(
					newClaim => {
						applyAuthToken(newClaim).then(authenticatedClaim => {
							createCompleteClaim(authenticatedClaim, newUser).then(completeClaim => {
								resolve(completeClaim);
							}).catch(err => reject(err));
						}).catch(err => reject(err));
					}
				).catch(err => reject(err));
			})
	    	.catch(err => reject(err));
		});
	});
}

export function authenticateUser(email, password, fromMobile = false){
	return new Promise((resolve, reject) => {
		getUserByEmailAndPassword(email, password).then(user => {
			applyAuthToken(user, fromMobile)
			.then(user => resolve(user))
			.catch(err => reject(err));
		})
		.catch(err => reject(err));
	});
}

function VerifyAndApplyAuthToken(user, fromMobile){
	return new Promise((resolve, reject) => {
		let token = null;
		fromMobile 
		? token = user.mobileToken
		: token = user.webToken;
		verifyToken(token).then(isValid => {
			resolve(user);
		})
		.catch(err => {
			applyAuthToken(user, fromMobile)
			.then(user => resolve(user))
			.catch(err => reject(err));
		});
	});
}

export function authenticateFacebookUser(accessToken, fromMobile){
	return new Promise((resolve, reject) => {
		getFacebookUser(accessToken).then(user => {
			getUserByEmail(user.email).then(user => {
				VerifyAndApplyAuthToken(user, fromMobile)
					.then(user => resolve(user))
					.catch(err => reject(err));
			})
			.catch(err => {
				saveThirdPartyUser(user.name, user.email, user.picture.data.url).then(newUser => {
					applyAuthToken(newUser, fromMobile)
					.then(user => resolve(user))
					.catch(err => reject(err));
		    	})
	    		.catch(err => reject(err));
			});
		})
		.catch(err => reject(err));
	});
}