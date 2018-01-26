export function saveErrorLog(errorLog){
	return new Promise((resolve, reject) => {
		errorLog.save().then(errorLog => {
			resolve(errorLog);
		}).catch(err => reject(err));
	}).catch(err => reject(err));
}