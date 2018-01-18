import { getUserDetails } from '../services/userService';

module.exports = {
	getAllUsers : (req, res) => {
		getUserDetails().then(
			userDetails => res.jsonAuthenticate(req, res, userDetails)
		)
		.catch(
			err => res.jsonError(err, res)
		);
	}
}
