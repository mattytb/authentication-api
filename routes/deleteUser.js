import { getUserById, deleteUser } from '../clients/userClient';

module.exports = {

	deleteUserByToken : (req, res) => {

		getUserById(req.body.userId).then(user => {

			if(req.body.userIdToDelete == user._id || user.admin){

				deleteUser(req.body.userIdToDelete).then(userId => {

					res.status(200).json({
						success:true,
						message:`User was successfully deleted ${userId}`
					});

				}).catch(err => {

					res.status(500).json({
						success:false,
						message:'Internal server error'
					});

				});
			}
			else {

				res.status(401).json({
					success:false,
					message:'401 unauthorised'
				});

			}
		})
		.catch(err => {

			res.status(500).json({
				success:false,
				message:'Internal server error'
			});

		});
		
	}
}

