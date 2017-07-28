import { saveTokenToUser, saveNewUser, getUserByEmail, getUserByEmailAndPassword, saveThirdPartyUser } from '../clients/userClient';
import { getFacebookUser } from '../clients/facebookClient';
import {applyAuthToken } from './authTokenService';
import {verifyToken} from '../clients/tokenClient';

export function authenticateNewUser(name, password, email){

	return new Promise((resolve, reject) => {

		getUserByEmail(email).then(user => {
			reject(new Error("A user already exists with this email"))
		})
		.catch(err => {
			saveNewUser(name, password, email).then(newUser => {
				applyAuthToken(newUser).then(user => {
					resolve(user);
		        })
		        .catch(err => reject(err));
	    	})
	    	.catch(err => reject(err));
		});
	});
}

export function authenticateUser(email, password){

	return new Promise((resolve, reject) => {

		getUserByEmailAndPassword(email, password).then(user => {
			applyAuthToken(user).then(user => {
				resolve(user);
			})
			.catch(err => reject(err));
		})
		.catch(err => reject(err));
	});
}

export function authenticateFacebookUser(accessToken){

	return new Promise((resolve, reject) => {

		getFacebookUser(accessToken).then(user => {

			getUserByEmail(user.email).then(user => {

				verifyToken(user.token).then(isValid => {
						resolve(user);
				})
				.catch(err => {

					applyAuthToken(user).then(user => {
						resolve(user);
        	})
        	
		    	.catch(err => reject(err));
				})
			})
			.catch(err => {

				saveThirdPartyUser(user.name, user.email, user.picture.data.url).then(newUser => {
					applyAuthToken(newUser).then(user => {
						resolve(user);
			        })
			        .catch(err => reject(err));
		    	})
	    		.catch(err => reject(err));
			});
		})
		.catch(err => reject(err));
	});
}