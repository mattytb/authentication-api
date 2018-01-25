module.exports = {
	hasAccessTokenClientIdAndExpires : (req, res, next) => {
		!req.body.accessToken || !req.body.clientId || !req.body.expires
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