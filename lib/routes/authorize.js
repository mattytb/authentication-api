import { authorizeUser } from '../services/authorizationService';

module.exports = {
	authorize : (req, res) => {
		authorizeUser(req.body.email, req.body.password, req.body.clientId, req.body.expires)
		.then(
			claim => res.status(200).json({success:true, claim:claim})
		)
		.catch(
			err => res.jsonError(err, res)
		);
	},
	getAuthorizationStatus : (req, res) => {
		res.jsonAuthorized(res);
	}
}

	


