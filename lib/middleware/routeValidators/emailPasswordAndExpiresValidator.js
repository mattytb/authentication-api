module.exports = {
	hasEmailPasswordAndExpires : (req, res, next) => {
		if(!req.body.email || !req.body.password || !req.body.expires){
			res.status(403).json(
				{ 
					success:false, 
					message:"missing credentials"}
			)
		}
		else {
			next();
		}
	}
}