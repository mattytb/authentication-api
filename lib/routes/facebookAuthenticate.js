import { authenticateFacebookUser } from '../services/authenticationService';

module.exports = {

	authenticate : (req, res) => {

		authenticateFacebookUser(req.body.accessToken, req.body.fromMobile).then(user => {
			let token = null;
			req.body.fromMobile 
			? token = user.mobileToken
			: token = user.webToken;
			var result = {
			    success: true,
			    message: 'Enjoy your token',
			    token: token,
			    userId: user._id,
			    name: user.name,
			    image:user.image  
			};

			res.status(200).json(result);

		})
		.catch(err => {
			res.status(409).json({ success: false, message: err.message });
		});

	}
}