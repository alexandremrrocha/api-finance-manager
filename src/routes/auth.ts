import * as jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
import express from "express";

const secret = 'textoseguro'

module.exports = (app: any) =>{
    const router = express.Router();

    router.post('/signin', async (req: any, res: any, next: any) => {        
        try {
            const user = await app.services.user.findUser({ email: req.body.email });            
            if(!user){
                throw new Error('Usuário ou senha incorreta');
            }
            if(bcrypt.compareSync(req.body.password, user.password)){
                const payload = {
                    id: user.id,
                    name: user.name,
                    password: user.password,
                };
                const token = jwt.encode(payload, secret);
                return res.status(200).json({ token });
            }else{                
                throw new Error('Usuário ou senha incorreta');
            }            
        } catch (error) {
            next(error);
        }                
    });

    router.post('/signup', async (req: any, res: any, next: any) =>{
        try {
            const result = await app.services.user.saveUser(req.body);
            res.status(201).json(result[0]);
        } catch (error: any) {
            next(error);
        }            
    });

    return router;
};