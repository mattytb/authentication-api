import User from '../models/user';
import bcrypt from 'bcryptjs';
import { provideNewUser } from '../models/providers/newUserProvider';
import { saveUser, getSaltRounds } from '../models/utils/userUtils';

export function getUserByEmail(email){
	var error = new Error("no user found for email");
	error.status = 401;

	return new Promise((resolve, reject) => {

		User.findOne({ email: email }).then(user => 
		{
			if(user){
				resolve(user);
			}
			else {
				reject(error);
			}
		})
		.catch(err => reject(err));
	});
}

export function getUserById(id){
	return new Promise((resolve, reject) => {
		User.findById(id).then(user => 
		{
			if(user){
				resolve(user);
			}
			else {
				reject(new Error("no user found for id"));
			}
		})
		.catch(err => reject(err));
	});
}

export function getUserByEmailAndPassword(email, password){

	var error = new Error("unable to find user with those credentials");
		error.status = 401;

	return new Promise((resolve, reject) => {
		User.findOne({email: email}).then(user => 
		{
			if(user){
				bcrypt.compare(password, user.password).then(result => {
					if(result){
						resolve(user);
					}
					else {
						reject(error);
					}
				})
				.catch(err => reject(err));
			}
			else {
				reject(error);
			}	
		})
		.catch(err => reject(err));
	});
}

export function saveThirdPartyUser(name, email, image, admin){
	return new Promise((resolve, reject) => {
		let newUser = provideNewUser(name, email, image, admin);
		saveUser(newUser)
	    	.then(user => resolve(user))
	    	.catch(err => reject(err)
	    );
	});
}

export function saveNewUser(username, password, email, admin){
	return new Promise((resolve, reject) => {
		let newUser = provideNewUser(username, email, admin);
		
		bcrypt.hash(password, getSaltRounds())
		.then(hash => {
			newUser.password = hash;
			saveUser(newUser)
			.then(user => resolve(user))
			.catch(err => reject(err));
		})
		.catch(err => reject(err));
	});
}

 export function getUsers(){
	return new Promise((resolve, reject) => {
		User.find({})
		.then(users => resolve(users))
		.catch(err => reject(err));
	});
 }

 export function deleteUserById(userId){
	return new Promise((resolve, reject) => {
		User.findOneAndRemove({ _id: userId })
		.then(userRemoved => resolve(userRemoved._id))
		.catch(err => reject(err));
	});
 }
 