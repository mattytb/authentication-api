module.exports = {
	hasRefreshToken : (req, res, next) => {
        if(!req.body.refreshToken){
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