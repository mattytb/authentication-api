import Express from 'express';
import BodyParser from 'body-parser';
import Morgan from 'morgan';
import Mongoose from 'mongoose'; 
import AddRoutes from './addRoutes';
import Config from './config';

const port = process.env.PORT || 8080; 


Mongoose.connect(Config.database); 


let app = Express(),
	router = Express.Router();
	

app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(Morgan('dev'));
app.use('/api', router);

AddRoutes(router);

app.listen(port);

console.log('Magic happens at http://localhost:' + port);