import { jsonError } from './jsonError';

export function errorResponseBuilder(req, res, next){
    res.jsonError = jsonError
	next();
}
