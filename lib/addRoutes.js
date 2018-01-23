import Index from './routes/index';
import Authorize from './routes/authorize';
import Register from './routes/register';
import DeleteUser from './routes/deleteUser';
import facebookAuthorize from './routes/facebookAuthorize';
import { hasEmailAndPassword } from './middleware/routeValidators/emailAndPasswordValidator';
import { hasNamePasswordEmailClientId } from './middleware/routeValidators/namePasswordEmailClientIdValidator';
import { hasAccessTokenAndClientId } from './middleware/routeValidators/accessTokenAndClientIdValidator';
import * as Authorization from './middleware/authorize';

function addRoutes(router){
	router.get('/users', Authorization.authorize, Index.getAllUsers);  
	router.post('/users', hasNamePasswordEmailClientId,  Register.registerUser);
	router.delete('/users/:user_id',  Authorization.authorize, DeleteUser.deleteUserByAuthorizationToken);
	router.post('/authorize', hasEmailAndPassword, Authorize.authorize);
	router.post('/authorize-facebook', hasAccessTokenAndClientId, facebookAuthorize.authorize);
	router.get('/authorizationStatus', Authorization.authorize, Authorize.getAuthorizationStatus);
} 

module.exports = addRoutes;
