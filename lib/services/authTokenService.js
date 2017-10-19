import { saveWebTokenToUser, saveMobileTokenToUser } from '../clients/userClient';
import { getWebToken, getMobileToken } from '../clients/tokenClient';

export function applyAuthWebToken(user){

	return new Promise((resolve, reject) => {
		user.webToken = null;
		const webToken = getWebToken(user);
		saveWebTokenToUser(user._id, webToken)
			.then(user => resolve(user))
			.catch(err => reject(err));
	});
}

export function applyAuthMobileToken(user){
	return new Promise((resolve, reject) => {
		user.mobileToken = null;
		const mobileToken = getMobileToken(user);
		saveMobileTokenToUser(user._id, mobileToken)
			.then(user => resolve(user))
			.catch(err => reject(err));
	});
}