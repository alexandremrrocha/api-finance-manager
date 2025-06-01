import express, { Application } from "express";

const app: Application = express();

const consign = require('consign');

consign({cwd: 'src', verbose: false})
    .include('./config/middleware.ts')
    .then('./routes')
    .then('./config/routes.ts')
    .into(app);

app.get('/', (req, res) => {
    res.status(200).send();
})

export default app; 