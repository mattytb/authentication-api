import { authenticateFacebookUser } from '../services/authenticationService';

module.exports = {

	authenticate : (req, res) => {

		authenticateFacebookUser(req.body.accessToken).then(user => {

			var result = {
			    success: true,
			    message: 'Enjoy your token',
			    token: user.token,
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