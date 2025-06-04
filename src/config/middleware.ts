import bodyParser from 'body-parser';

module.exports = (app: any) =>{
    app.use(bodyParser.json());
};
 