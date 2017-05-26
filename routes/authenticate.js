
import {applyAuthToken} from '../modules/applyAuthToken';
import { getUserByNameAndPassword } from '../clients/userClient';

module.exports = {

	getAuthToken : (req, res) => {

		getUserByNameAndPassword(req.body.name, req.body.password).then(user => {

			applyAuthToken(user).then(user => {

				res.status(200).json({
		          success: true,
		          message: 'Enjoy your token',
		          token: user.token,
		          userId: user._id
				});

			}).catch(err => {

				res.status(500).json({ success: false, message: err });

			});

		}).catch(err => {

			res.status(401).json({ success: false, message: err });
			
		});
	}
}

	


