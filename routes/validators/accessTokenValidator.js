module.exports = {

	hasAccessToken : (req, res, next) => {

		if(!req.body.accessToken){

			res.status(403).json({ success:false, message:"missing access token"});

		}
		else {

			next();
		}
	}
	
}