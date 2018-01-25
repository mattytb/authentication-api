module.exports = {
	hasNamePasswordEmailClientIdAndExpires : (req, res, next) => {
		!req.body.name || !req.body.password || 
		!req.body.email || !req.body.clientId || !req.body.expires
		?
		res.status(403).json(
			{ 
				success:false, 
				message:"missing credentials"
			}
		)
		:
		next();
	}
}