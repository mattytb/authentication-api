module.exports = {

	hasEmailAndPassword : (req, res, next) => {

		if(!req.body.email || !req.body.password){

			res.status(403).json({ success:false, message:"missing credentials"});

		}
		else {

			next();
		}
	}
	
}