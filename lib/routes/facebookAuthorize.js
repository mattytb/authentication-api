import { authorizeFacebookUser } from '../services/authorizationService';

module.exports = {
	authorize : (req, res) => {
		authorizeFacebookUser(req.body.accessToken, req.body.clientId, req.body.expires)
		.then(
			claim => {
				res.status(200).json({
					success:true, 
					claim:claim
				})
			}
		)
		.catch(                 
			err => res.jsonError(err, res)
		);
	}
}