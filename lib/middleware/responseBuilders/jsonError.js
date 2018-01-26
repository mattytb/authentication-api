import { logError } from '../../clients/errorLogClient';

export function jsonError(error, res){
    if(!error.status) error.status = 500;
    if(error.status === 500) logError(error);
    return res.status(error.status).json({
        success: false,
        message : error.message
    })
}