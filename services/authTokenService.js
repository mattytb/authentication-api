import { saveTokenToUser } from '../clients/userClient';
import { getToken } from '../clients/tokenClient';

export function applyAuthToken(user){

	return new Promise((resolve, reject) => {

		user.token = null;

		const token = getToken(user);

		saveTokenToUser(user._id, token)
		.then(user => resolve(user))
		.catch(err => reject(err));

  	});
}