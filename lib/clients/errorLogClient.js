
import { provideNewErrorLog } from '../models/providers/newErrorLogProvider';
import { saveErrorLog } from '../models/utils/errorLogUtils';

export function logError(error) {
    return new Promise((resolve, reject) => {
        let errorLog = provideNewErrorLog(error);
        saveErrorLog(errorLog)
            .then(errorLog => {
                resolve(errorLog)
            })
            .catch(err => reject(err)
        )
    });
}