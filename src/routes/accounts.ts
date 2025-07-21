import express from "express";
import {ForbiddenError} from "../errors/ForbiddenError";

module.exports = (app: any) =>{
    const router = express.Router();

    router.param('id', async (req: any, res: any, next: any) =>{
        const account = await app.services.account.find({id: req.params.id});
        if(account.user_id == req.user.id){
            return next();
        }
        throw new ForbiddenError('Este recurso não pertence ao usuário');
    });

    router.post('/', async (req: any, res: any, next: any) =>{
        try {
            const result = await app.services.account.saveAccount({...req.body, user_id: req.user.id});
            return res.status(201).json(result[0]);      
        } catch (error: any) {
            next(error);
        }
    });

    router.get('/', async (req: any, res: any, next: any) =>{
        try {
            const result = await app.services.account.findByUserId(req.user.id);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    });

    router.get('/:id', async (req: any, res: any, next: any) =>{
         try {
            const result = await app.services.account.find({id: req.params.id});
            if(result.user_id != req.user.id){
                return res.status(403).json({message: 'Este recurso não pertence ao usuário'});
            }
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }        
    });

    router.put('/:id', async (req: any, res: any, next: any) =>{
         try {
            const result = await app.services.account.updateById(req.params.id, req.body);
            return res.status(200).json(result[0]);
        } catch (error) {
            next(error);
        }        
    });

    router.delete('/:id', async(req: any, res: any, next: any) =>{
         try {
            const result = await app.services.account.removeById(req.params.id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }        
    });

    return router;
} 