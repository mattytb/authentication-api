import { getUserById } from '../clients/userClient';
import { verifyToken } from '../clients/tokenClient';

export function verifyUser(userId, token){

	return new Promise((resolve, reject) => {

		verifyToken(token).then(validToken => {

			if(!validToken) {
				reject("Invalid user");
			}
			else {

				getUserById(userId).then(user => {
					
					if(user.token !== token){
						reject("Invalid user");
					}
					else {
						resolve(true);
					}

				}).catch(err => reject("Invalid user"));
			}
			
		})
		.catch(err => reject("Invalid user"));

	});
}

