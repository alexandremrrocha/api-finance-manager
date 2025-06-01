import express, { Application } from "express";
import User from "./interface/UserInterface";

const app: Application = express();

const consign = require('consign');

consign({cwd: 'src', verbose: false})
    .include('./config/middleware.ts')
    .into(app);

app.get('/', (req, res) => {
    res.status(200).send();
})

app.get('/users', (req, res) => {
    const users: User[] = [{
        name: 'John Doe',
        email: 'johndoe@email.com'
    }];
    res.status(200).json(users);    
})

app.post('/users', (req, res) =>{
    res.status(201).json(req.body);
})

export default app; 