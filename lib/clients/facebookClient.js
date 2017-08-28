import Axios from 'axios';

const graphUri = 'https://graph.facebook.com/me';
const requestFields = 'email,name,picture';

export function getFacebookUser(accessToken) {

	return new Promise((resolve, reject) => {
		Axios.get(`${graphUri}?access_token=${accessToken}&fields=${requestFields}`).then(response => {
			if(!response.data.email){
				reject(new Error("Access token was invalid"))
			}
			else {
				resolve(response.data);
			}
		}).catch(err => {
			reject(err);
		})
	});

}

