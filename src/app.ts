import express from "express";
import knex from "knex";
import knexfile from "../knexfile";
import winston from "winston";
import { randomUUID } from 'crypto';

const app: any = express();

app.db = knex(knexfile.test)

const consign = require('consign');

app.log = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({format: winston.format.json({space: 1})}),
        new winston.transports.File({filename: 'logs/error.log', level: 'warn', format: winston.format.combine(winston.format.timestamp(), winston.format.json({space: 1}))}),
    ],
})

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
    if(name == 'ForbiddenError'){
        res.status(403).json({message});
    }else if(name == 'ValidationError'){
        res.status(400).json({message});
    }else{
        const id = randomUUID();
        app.log.error({id, name, message, stack});
        res.status(500).json({id, error: 'Falha interna' });
    }    
    next(error);
});

export default app; 
