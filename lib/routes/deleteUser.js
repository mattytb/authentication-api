import { deleteUser } from '../services/userService';

module.exports = {
	deleteUserByAuthorizationToken : (req, res) => {
		deleteUser(res.locals.authorizationToken, req.params.user_id)
		.then(
			result => {
				res.status(200).json({
					success:true,
					message:result
				});
			}
		)
		.catch(
			err => res.jsonError(err, res)
		)
	}
}

