import User from '../models/user';
import bcrypt from 'bcryptjs';
import {provideNewUser} from '../models/providers/newUserProvider';
import {saveUser, getSaltRounds} from '../models/utils/userUtils';

export function getUserByName(name){

	return new Promise((resolve, reject) => {

		User.findOne({name: name}).then(user => 
		{
			user ? resolve(user) : reject(new Error("no user found for name"))
		})
		.catch(err => reject(err));

	});
}

export function getUserById(id){

	return new Promise((resolve, reject) => {

		User.findOne({_id: id}).then(user => 
		{
			user ? resolve(user) : reject(new Error('no user found for id'))
		})
		.catch(err => reject(err));

	});
}

export function getUserByNameAndPassword(name, password){

	return new Promise((resolve, reject) => {

		User.findOne({name: name}).then(user => 
		{
			
			if(user){
				bcrypt.compare(password, user.password).then(res => {
					res ? resolve(user) : reject(new Error("unable to find users with those credentials"));
				})
				.catch( err => reject(err));
			}
			else {
				reject(new Error("unable to find users with those credentials"));
			}	

		})
		.catch(err => reject(err));

	});
}

export function saveTokenToUser(userId, token){

	return new Promise((resolve, reject) => {

		User.findById(userId).then(user => {
			user.token = token;
			user.save();
			resolve(user);
		})
		.catch( err =>	reject(err));
	});
}

export function saveNewUser(username, password, email, admin){

	return new Promise((resolve, reject) => {

		let newUser = provideNewUser(username, email, admin);

      	bcrypt.hash(password, getSaltRounds()).then(hash => {

    		newUser.password = hash;

	        saveUser(newUser)
	        	.then(user => resolve(user))
	        	.catch(err => reject(err)
	        );

		}).catch(err => reject(err));

    });
 }

 export function getUsers(){

 	return new Promise((resolve, reject) => {

	 	User.find({})
	 	.then(users => resolve(users))
	 	.catch(err => reject(err));

	});
 }

 export function deleteUser(userId){

 	return new Promise((resolve, reject) => {

		User.findOneAndRemove({ _id: userId })
		.then(userRemoved => resolve(userRemoved._id))
		.catch(err => reject(err));
		
	});
 }
 