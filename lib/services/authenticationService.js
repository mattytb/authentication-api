import { saveWebTokenToUser, saveNewUser, getUserByEmail, getUserByEmailAndPassword, saveThirdPartyUser } from '../clients/userClient';
import { getFacebookUser } from '../clients/facebookClient';
import { applyAuthWebToken, applyAuthMobileToken } from './authTokenService';
import { verifyToken } from '../clients/tokenClient';

function applyAuthToken(user, fromMobile){
	return new Promise((resolve, reject) => {
		
		fromMobile 
		? applyAuthMobileToken(user)
		.then(user => resolve(user))
		.catch(err => reject(err))

		: applyAuthWebToken(user)
		.then(user => resolve(user))
		.catch(err => reject(err));
	});
}

export function authenticateNewUser(name, password, email, fromMobile = false){
	return new Promise((resolve, reject) => {
		getUserByEmail(email).then(user => {
			reject(new Error("A user already exists with this email"))
		})
		.catch(err => {
			saveNewUser(name, password, email).then(newUser => {
				applyAuthToken(newUser, fromMobile)
				.then(user => resolve(user))
				.catch(err => reject(err));
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