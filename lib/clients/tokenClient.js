import WebToken from 'jsonwebtoken';
import Config from '../config';

export function getWebToken(user){
	return WebToken.sign(user, Config.secret, {
		expiresIn: Config.webTokenExpiry
	});
}

export function getMobileToken(user){
	return WebToken.sign(user, Config.secret, {
		expiresIn: Config.mobileTokenExpiry
	});
}

export function verifyToken(token){
	return new Promise((resolve, reject) => {
		WebToken.verify(token, Config.secret, (err, decoded) => {
			err ? reject('User is not verified') : resolve(true);
		});
	});
}

