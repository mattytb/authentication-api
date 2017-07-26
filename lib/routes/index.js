
import { getUsers } from '../clients/userClient';

module.exports = {

	getAllUsers : (req, res) => {

		getUsers().then(users => {

			users = users.map((user) => { return {name:user.name, id:user.id, image:user.image}; });

			res.status(200).json(users);

		}).catch(err => {

			res.status(500).json({success:false, message:err});

		});
	}
}
