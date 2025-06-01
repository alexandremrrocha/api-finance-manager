import bodyParser from 'body-parser';
import { Application } from 'express';

module.exports = (app: Application) =>{
    app.use(bodyParser.json());
};
 