import User from '../user';
export function provideNewUser(username, email, admin){
	var user = new User({ 
			name: username,
	        email: email,
	        admin:admin
  		});
	return user;
}