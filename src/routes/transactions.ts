import express from "express";
import { ForbiddenError } from "../errors/ForbiddenError";

module.exports = (app: any) => {
    const router = express.Router();

    router.param('id', async (req: any, res, next) =>{
        const transaction = await app.services.transaction.find(req.user.id, {'transactions.id': req.params.id});
        try {
            if(transaction.length > 0){
                next();
            }else{
                throw new ForbiddenError('Este recurso não pertence ao usuário');
            }            
        } catch (error) {
            next(error);
        }        
    });
    
    router.get('/', async (req: any, res, next) =>{
        try{
            const result = await app.services.transaction.find(req.user.id);
            return res.status(200).json(result);
        }catch(error){
            next(error);
        }        
    });

    router.post('/', async (req, res, next) =>{
        try {
            const result = await app.services.transaction.save(req.body);
            return res.status(201).json(result[0]);
        } catch (error) {
            next(error);
        }
    });

    router.get('/:id', async (req: any, res, next) =>{
        try {
            const result = await app.services.transaction.findOne({id: req.params.id});
            return res.status(200).json(result);
        } catch (error) {
             next(error);
        }
    });

    router.patch('/:id', async (req: any, res, next) =>{
        try {
            const result = await app.services.transaction.update(req.body, {id: req.params.id});
            return res.status(200).json(result[0]);
        } catch (error) {
             next(error);
        }
    });

    router.delete('/:id', async (req: any, res, next) =>{
        try {
            await app.services.transaction.remove({id: req.params.id});
            
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    })

    return router;
}