module.exports = {
	hasAccessToken : (req, res, next) => {
		!req.body.accessToken 
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