import { saveTokenToUser, saveNewUser, getUserByEmail, getUserByEmailAndPassword} from '../clients/userClient';
import {applyAuthToken } from './authTokenService';

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