import Express from 'express';
import BodyParser from 'body-parser';
import Morgan from 'morgan';
import Mongoose from 'mongoose'; 
import AddRoutes from './addRoutes';
import Config from './config';
import Cors from 'cors';

const port = process.env.PORT || 8080;

let dbConnectionString = '';

if(process.env.NODE_ENV === 'production'){
	dbConnectionString = Config.database_prod;
}
else {
	dbConnectionString = Config.database_local;
}

var promise = Mongoose.connect(Config.database_local, {
	useMongoClient: true,
	/* other options */
  });
let app = Express(),
	router = Express.Router();
	
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(Morgan('dev'));
app.use(Cors());
app.use('/api', router);

AddRoutes(router);

app.listen(port);

console.log('Magic happens at http://localhost:' + port);