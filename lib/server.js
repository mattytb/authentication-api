import Express from 'express';
import BodyParser from 'body-parser';
import Morgan from 'morgan';
import Mongoose from 'mongoose'; 
import AddRoutes from './addRoutes';
import Config from './config';
import Cors from 'cors';
import { errorResponseBuilder } from '../lib/middleware/responseBuilders/responseBuilders';


process.env.NODE_ENV == 'unit' ?  process.env.PORT = 85 : 8080;

const port = process.env.PORT || 8080;

let dbConnectionString = '';

if(process.env.NODE_ENV === 'production'){
	dbConnectionString = Config.database_prod;
}
else {
	dbConnectionString = Config.database_local;
}

if(process.env.NODE_ENV !== 'unit'){
	
	var promise = Mongoose.connect(dbConnectionString, {
		useMongoClient: true,
	});
}
let app = Express(),
	router = Express.Router();
	
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(errorResponseBuilder);
app.use(Morgan('dev'));
app.use(Cors());
app.use('/api', router);

AddRoutes(router);

app.listen(port);

module.exports = app;