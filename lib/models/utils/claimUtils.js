export function saveClaim(claim){
	return new Promise((resolve, reject) => {
		claim.save().then(claim => {
			resolve(claim);
		}).catch(err => reject(err));
	});
}