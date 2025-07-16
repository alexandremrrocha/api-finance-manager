import express from "express";

module.exports = (app: any) =>{
    const router = express.Router();

    router.post('/', async (req: any, res: any, next: any) =>{
        try {
            const result = await app.services.account.saveAccount(req.body);
            return res.status(201).json(result[0]);      
        } catch (error: any) {
            next(error);
        }
    });

    router.get('/', async (req: any, res: any, next: any) =>{
        try {
            const result = await app.services.account.getAll();
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    });

    router.get('/:id', async (req: any, res: any, next: any) =>{
         try {
            const result = await app.services.account.find({id: req.params.id});
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