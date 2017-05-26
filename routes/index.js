
import { getUsers } from '../clients/userClient';

module.exports = {

	getAllUsers : (req, res) => {

		getUsers().then(users => {

			res.status(200).json(users);

		}).catch(err => {

			res.status(500).json({success:false, message:err});

		});
	}
}
