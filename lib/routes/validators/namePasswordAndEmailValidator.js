module.exports = {
	hasNamePasswordAndEmail : (req, res, next) => {
		!req.body.name || !req.body.password || !req.body.email
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