import WebToken from 'jsonwebtoken';
import Config from '../config';

export function getToken(payload){
	return WebToken.sign(payload, Config.secret, {
		expiresIn: Config.webTokenExpiry
	});
}
export function verifyToken(token){
	return new Promise((resolve, reject) => {
		WebToken.verify(token, Config.secret, (err, decoded) => {
			err ? reject('User is not verified') : resolve(true);
		});
	});
}

