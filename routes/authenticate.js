import {authenticateUser} from '../services/authenticationService';

module.exports = {

	getAuthToken : (req, res) => {

		authenticateUser(req.body.email, req.body.password).then(user => {

			const result = {
		          success: true,
		          message: 'Enjoy your token',
		          token: user.token,
		          userId: user._id
			}

			res.status(200).json(result);

		}).catch(err => {
			res.status(401).json({ success: false, message: err.message });
		});
	}
}

	


