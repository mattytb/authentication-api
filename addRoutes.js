
import Index from './routes/index';
import Authenticate from './routes/authenticate';
import Register from './routes/register';
import DeleteUser from './routes/deleteUser';
import { isVerified } from './routes/validators/authenticationValidator';
import { hasNameAndPassword } from './routes/validators/nameAndPasswordValidator';
import { hasNamePasswordAndEmail } from './routes/validators/namePasswordAndEmailValidator';

function addRoutes(router){

	router.get('/users', isVerified, Index.getAllUsers);  
	router.post('/users', hasNamePasswordAndEmail,  Register.registerUser);
	router.delete('/users/:user_id', isVerified, DeleteUser.deleteUserByToken);
	router.post('/authenticate', hasNameAndPassword, Authenticate.getAuthToken);
} 

module.exports = addRoutes;
