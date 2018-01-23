import { getUserDetails } from '../services/userService';

module.exports = {
	getAllUsers : (req, res) => {
		getUserDetails().then(
			userDetails => res.jsonAuthorized(res, userDetails)
		)
		.catch(
			err => res.jsonError(err, res)
		);
	}
}
