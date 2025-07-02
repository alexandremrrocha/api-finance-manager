module.exports = (app: any) =>{

    const createAcount = async (req: any, res: any, next: any) =>{
        try {
            const result = await app.services.account.saveAccount(req.body);
            return res.status(201).json(result[0]);      
        } catch (error: any) {
            next(error);
        }
    }

    const getAll = async (req: any, res: any, next: any) =>{
        try {
            const result = await app.services.account.getAll();
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    const getById = async (req: any, res: any, next: any) =>{
         try {
            const result = await app.services.account.find({id: req.params.id});
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }        
    };

    const updateById = async (req: any, res: any, next: any) =>{
         try {
            const result = await app.services.account.updateById(req.params.id, req.body);
            return res.status(200).json(result[0]);
        } catch (error) {
            next(error);
        }        
    };

    const removeById = async(req: any, res: any, next: any) =>{
         try {
            const result = await app.services.account.removeById(req.params.id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }        
    };

    return {createAcount, getAll, getById, updateById, removeById};
} 