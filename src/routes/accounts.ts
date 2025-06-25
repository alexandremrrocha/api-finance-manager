module.exports = (app: any) =>{
    const createAcount = async (req: any, res: any) =>{
        const result = await app.services.account.saveAccount(req.body);  
        return res.status(201).json(result[0]);         
    }

    const getAll = async (req: any, res: any) =>{
        const result = await app.services.account.getAll();
        return res.status(200).json(result);
    };

    const getById = async (req: any, res: any) =>{
        const result = await app.services.account.find({id: req.params.id});
        return res.status(200).json(result);
    };

    return {createAcount, getAll, getById};
} 