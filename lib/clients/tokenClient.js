import WebToken from 'jsonwebtoken';
import Config from '../config';

export function getAuthorizationToken(payload){
	return WebToken.sign(payload, Config.secret, {
		expiresIn: Config.tokenExpiry
	});
}
export function verifyAuthorizationToken(authorizationToken){

	let error = new Error();
	error.message = "Unauthorized: invalid authorization token";
	error.status = 401;

	return new Promise((resolve, reject) => {
		WebToken.verify(authorizationToken, Config.secret, (err, decoded) => {
			err ? reject(error) : resolve(true);
		});
	});
	
}

