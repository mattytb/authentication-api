module.exports = {
	hasNamePasswordEmailClientId : (req, res, next) => {
		!req.body.name || !req.body.password || !req.body.email || !req.body.clientId
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