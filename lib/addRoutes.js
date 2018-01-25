import Index from './routes/index';
import Authorize from './routes/authorize';
import Register from './routes/register';
import DeleteUser from './routes/deleteUser';
import facebookAuthorize from './routes/facebookAuthorize';
import { hasEmailPasswordAndExpires } from './middleware/routeValidators/emailPasswordAndExpiresValidator';
import { hasNamePasswordEmailClientIdAndExpires } from './middleware/routeValidators/namePasswordEmailClientIdAndExpiresValidator';
import { hasAccessTokenClientIdAndExpires } from './middleware/routeValidators/accessTokenClientIdAndExpiresValidator';
import { hasRefreshToken } from './middleware/routeValidators/refreshTokenValidator';
import * as Authorization from './middleware/authorize';

function addRoutes(router){
	router.get('/users', Authorization.authorize, Index.getAllUsers);  
	router.post('/users', hasNamePasswordEmailClientIdAndExpires,  Register.registerUser);
	router.delete('/users/:user_id',  Authorization.authorize, DeleteUser.deleteUserByAuthorizationToken);
	router.post('/authorize', hasEmailPasswordAndExpires, Authorize.authorize);
	router.post('/authorize-facebook', hasAccessTokenClientIdAndExpires, facebookAuthorize.authorize);
	router.get('/authorizationStatus', Authorization.authorize, Authorize.getAuthorizationStatus);
	router.post('/refreshAuthorizationToken', hasRefreshToken, Authorize.refreshAuthorizationToken)
} 

module.exports = addRoutes;
