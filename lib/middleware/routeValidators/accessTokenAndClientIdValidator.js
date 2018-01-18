module.exports = {
	hasAccessTokenAndClientId : (req, res, next) => {
		!req.body.accessToken || !req.body.clientId
		?
		res.status(403).json(
			{ 
				success:false, 
				message:"missing access token"
			}
		)
		:
		next();
	}
}