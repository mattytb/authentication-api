import User from '../user';

export function provideNewUser(username, email, image = "", admin = false){
	return new User({ 
		name: username,
		email: email,
		admin:admin,
		image: image
	});
}