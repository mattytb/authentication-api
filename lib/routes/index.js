import { getUserDetails } from '../services/userService';

module.exports = {
	getAllUsers : (req, res) => {
		getUserDetails()
		.then(
			userDetails => {
				res.status(200).json({
					success:true, 
					users:userDetails
				})
			}
		)
		.catch(
			err => res.jsonError(err, res)
		);
	}
}
