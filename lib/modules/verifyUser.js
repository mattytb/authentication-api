import { getUserById } from '../clients/userClient';
import { verifyToken } from '../clients/tokenClient';

export function verifyUser(userId, token){
	return new Promise((resolve, reject) => {
		verifyToken(token).then(validToken => {
			if(!validToken) {
				reject(new Error("Token is invalid"));
			}
			else {
				getUserById(userId).then(user => {
					user.webToken !== token && user.mobileToken !== token 
					?	reject(new Error("Invalid user"))
					:	resolve(true);
				})
				.catch(err => reject(new Error("Could not find user")));
			}
		})
		.catch(err => reject(new Error("Could not verify token")));
	});
}

