import Express from 'express'; 
import WebToken from 'jsonwebtoken';
import Config from '../config';

let app  = Express();

app.set('superSecret', Config.secret);
app.set('tokenExpires', Config.tokenExpiry)

export function getToken(user){
	return WebToken.sign(user, app.get('superSecret'), {
		expiresIn: app.get('tokenExpires')
	});
}

export function verifyToken(token){
	return new Promise((resolve, reject) => {
		WebToken.verify(token, app.get('superSecret'), (err, decoded) => {
			err ? reject('User is not verified') : resolve(true);
		});
	});
}

