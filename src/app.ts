import express from "express";
import knex from "knex";
import knexfile from "../knexfile";

const app: any = express();

//TODO: criar chaveamento dinamico
app.db = knex(knexfile.test)

const consign = require('consign');

consign({cwd: 'src', verbose: false})
    .include('./config/middleware.ts')
    .then('./routes')
    .then('./config/routes.ts')
    .into(app);

app.get('/', (req: any, res: any) => {
    res.status(200).send();
})

export default app; 