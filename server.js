import Express from 'express';
import BodyParser from 'body-parser';
import Morgan from 'morgan';
import Mongoose from 'mongoose'; 
import AddRoutes from './addRoutes';

import Config from './config';

const port = process.env.PORT || 8080; 

Mongoose.Promise = global.Promise;
Mongoose.connect(Config.database); 

let app = Express();

app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(Morgan('dev'));

AddRoutes(app);

app.listen(port);

console.log('Magic happens at http://localhost:' + port);