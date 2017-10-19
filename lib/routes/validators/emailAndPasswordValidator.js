module.exports = {
	hasEmailAndPassword : (req, res, next) => {
		!req.body.email || !req.body.password
		? res.status(403).json(
			{ 
				success:false, 
				message:"missing credentials"}
		)
		: next();
	}
}