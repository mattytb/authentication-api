
import Index from './routes/index';
import Authenticate from './routes/authenticate';
import Register from './routes/register';
import DeleteUser from './routes/deleteUser';
import { isVerified } from './routes/validators/authenticationValidator';
import { hasEmailAndPassword } from './routes/validators/emailAndPasswordValidator';
import { hasNamePasswordAndEmail } from './routes/validators/namePasswordAndEmailValidator';

function addRoutes(router){

	router.get('/users', isVerified, Index.getAllUsers);  
	router.post('/users', hasNamePasswordAndEmail,  Register.registerUser);
	router.delete('/users/:user_id', isVerified, DeleteUser.deleteUserByToken);
	router.post('/authenticate', hasEmailAndPassword, Authenticate.getAuthToken);
} 

module.exports = addRoutes;
