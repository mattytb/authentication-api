import User from '../user';
export function provideNewUser(username, email, image = "", admin = false){
	var user = new User({ 
			name: username,
	        email: email,
	        admin:admin,
	        image: image
  		});
	return user;
}