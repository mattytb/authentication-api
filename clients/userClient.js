import User from '../models/user';
import bcrypt from 'bcrypt';
const saltRounds = 10;

export function getUserByName(name){

	return new Promise((resolve, reject) => {

		User.findOne({name: name}).then(user => 
		{
			user ? resolve(user) : reject("unable to find user")

		})
		.catch(
			err => reject("unable to find user")
		);

	});
}

export function getUserById(id){

	return new Promise((resolve, reject) => {

		User.findOne({_id: id}).then(user => 
		{
			user ? resolve(user) : reject("unable to find user")
		})
		.catch(

			err => reject("unable to find user")
		);

	});
}

export function getUserByNameAndPassword(name, password){

	return new Promise((resolve, reject) => {

		User.findOne({name: name}).then(user => 
		{
			
			if(user){

				bcrypt.compare(password, user.password).then(res => {

					res ? resolve(user) : reject("unable to find users with those credentials")

				})
				.catch(

					res => reject("unable to find users with those credentials")
				);
			}
			else {

				reject("unable to find users with those credentials")
			}	

		})
		.catch(

			err => reject("unable to find users with those credentials")
		);

	});
}

export function saveTokenToUser(userId, token){

	return new Promise((resolve, reject) => {

		User.findById(userId).then(user => {
			user.token = token;
			user.save();
			resolve(user);
		})
		.catch(
			err =>	reject("unable to find user to save token to user")
		);
	});
}

export function saveNewUser(username, password, email, admin){

	return new Promise((resolve, reject) => {

		let newUser = new User({ 
            name: username,
            email: email,
            token:"",
            admin:true
      	});

      	bcrypt.hash(password, saltRounds).then(hash => {

    		newUser.password = hash;

	        newUser.save().then(

	        	user => resolve(user)
        	)
	        .catch(

	      		err => reject('problem saving user')
			);
		});

    });
 }

 export function getUsers(){

 	return new Promise((resolve, reject) => {

	 	User.find({})
	 	.then(

			users => resolve(users)

	 	)
	 	.catch(

	 		err => reject('could not find users')
		);

	});
 }

 export function deleteUser(userId){

 	return new Promise((resolve, reject) => {

		User.remove({ _id: userId }, (err) => {
  			if (err) {
  				reject(err);
  			}
  			else {
  				resolve(userId);
  			}
		});
	});
 }
 