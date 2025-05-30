import express from "express";
import User from "./interface/UserInterface";

const app = express();

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

export default app; 