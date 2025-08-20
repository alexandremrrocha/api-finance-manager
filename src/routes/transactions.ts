import express from "express";

module.exports = (app: any) => {
    const router = express.Router();
    
    router.get('/', async (req: any, res, next) =>{
        try{
            const result = await app.services.transaction.find(req.user.id);
            return res.status(200).json(result);
        }catch(error){
            next(error);
        }        
    })

    return router;
}