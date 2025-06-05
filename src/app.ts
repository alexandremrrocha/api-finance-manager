import express from "express";
import knex from "knex";
import knexfile from "../knexfile";

//const knexLogger = require('knex-logger');

const app: any = express();

//TODO: criar chaveamento dinamico
app.db = knex(knexfile.test)

//app.use(knexLogger(app.db));

const consign = require('consign');

consign({cwd: 'src', verbose: false})
    .include('./config/middleware.ts')
    .then('./services')
    .then('./routes')
    .then('./config/routes.ts')
    .into(app);

app.get('/', (req: any, res: any) => {
    res.status(200).send();
})

export default app; 