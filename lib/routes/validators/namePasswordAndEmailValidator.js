module.exports = {

	hasNamePasswordAndEmail : (req, res, next) => {

		if(!req.body.name || !req.body.password || !req.body.email){

			res.status(403).json({ success:false, message:"missing credentials"});

		}
		else {

			next();
		}
	}
	
}