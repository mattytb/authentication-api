import { deleteUser } from '../services/userService';

module.exports = {
	deleteUserByAuthorizationToken : (req, res) => {
		deleteUser(res.locals.authorizationToken, req.params.user_id)
		.then(
			result => res.jsonAuthorized(res, result)
		)
		.catch(
			err => res.jsonError(err, res)
		)
	}
}

