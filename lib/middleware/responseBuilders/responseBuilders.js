import { jsonError } from './jsonError';
import { jsonAuthorized } from './jsonAuthorized';

export function errorResponseBuilder(req, res, next){
    res.jsonError = jsonError
	next();
}

export function authorizedResponseBuilder(req, res, next){
    res.jsonAuthorized = jsonAuthorized
	next();
}
