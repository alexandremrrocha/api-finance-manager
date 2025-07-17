import express from "express";
import knex from "knex";
import knexfile from "../knexfile";

const app: any = express();

app.db = knex(knexfile.test)

const consign = require('consign');

consign({cwd: 'src', verbose: false})
    .include('./config/passport.ts')
    .then('./config/middleware.ts')
    .then('./services')
    .then('./routes')
    .then('./config/router.ts')
    .into(app);

app.get('/', (req: any, res: any) => {
    res.status(200).send();
})

app.use((error: any, req: any, res: any, next: any) =>{
    const {name, message, stack} = error;
    res.status(500).json({message, stack});
    next(error);
});

export default app; 