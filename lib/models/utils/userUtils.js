import Config from '../../config';
import Express from 'express';
let app  = Express();

app.set('saltRounds', Config.saltRounds);

export function saveUser(user){

	return new Promise((resolve, reject) => {

		user.save().then(user => {
			resolve(user);
		}).catch(err => reject(err));
		
	});
}

export function getSaltRounds(){
	return app.get('saltRounds');
}