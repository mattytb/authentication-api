
import Index from './routes/index';
import Authenticate from './routes/authenticate';
import Register from './routes/register';
import DeleteUser from './routes/deleteUser';
import { isVerified } from './routes/validators/authenticationValidator';
import { hasNameAndPassword } from './routes/validators/nameAndPasswordValidator';
import { hasNamePasswordAndEmail } from './routes/validators/namePasswordAndEmailValidator';

function addRoutes(app){

	app.get('/', isVerified, Index.getAllUsers);
	app.post('/authenticate', hasNameAndPassword, Authenticate.getAuthToken);  
	app.post('/register', hasNamePasswordAndEmail,  Register.registerUser);
	app.delete('/deleteUser', isVerified, DeleteUser.deleteUserByToken);
} 

module.exports = addRoutes;
