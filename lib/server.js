import Express from 'express';
import BodyParser from 'body-parser';
import Morgan from 'morgan';
import Mongoose from 'mongoose'; 
import AddRoutes from './addRoutes';
import Config from './config';
import Cors from 'cors';

const port = process.env.PORT || 75;

let dbConnectionString = '';

if(process.env.NODE_ENV === 'production'){
		dbConnectionString = Config.database_prod;
}
else {
		dbConnectionString = Config.database_local;
}

Mongoose.connect(dbConnectionString, function (err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + dbConnectionString + '. ' + err);
	} else {
		console.log ('Successfully connected to: ' + dbConnectionString);
	}
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