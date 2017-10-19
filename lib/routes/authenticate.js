import {authenticateUser } from '../services/authenticationService';
import { verifyUser } from '../modules/verifyUser';

module.exports = {

	getAuthToken : (req, res) => {

		authenticateUser(req.body.email, req.body.password, req.body.fromMobile).then(user => {
			let token = null;

			req.body.fromMobile ? token = user.mobileToken : token = user.webToken;

			const result = {
		          success: true,
		          message: 'Enjoy your token',
		          token: token,
		          userId: user._id
			}

			res.status(200).json(result);

		})
		.catch(err => {
			res.status(401).json({ success: false, message: err.message });
		});
	},

	getAuthStatus : (req, res) => {

		res.status(200).json({success : true});
	}
}

	


