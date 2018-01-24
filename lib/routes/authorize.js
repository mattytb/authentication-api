import { authorizeUser } from '../services/authorizationService';
import { getAuthorizationTokenWithValidRefreshToken } from '../services/claimService';

module.exports = {
	authorize : (req, res) => {
		authorizeUser(req.body.email, req.body.password, req.body.clientId, req.body.expires)
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
	},
	getAuthorizationStatus : (req, res) => {
		res.status(200).json({
			success:true
		});
	},
	refreshAuthorizationToken : (req, res) => {
        getAuthorizationTokenWithValidRefreshToken(req.body.refreshToken)
        .then(
            authorizationToken => {
                res.status(200).json({
                    success:true,
                    authorizationToken:authorizationToken
                })
            }
        )
        .catch(err => res.jsonError(err, res));
    }
}

	


