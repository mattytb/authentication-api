module.exports = {

	hasNameAndPassword : (req, res, next) => {

		if(!req.body.name || !req.body.password){

			res.status(403).json({ success:false, message:"missing credentials"});

		}
		else {

			next();
		}
	}
	
}