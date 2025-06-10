module.exports = (app: any) =>{
    const createAcount = async (req: any, res: any) =>{
        const result = await app.services.account.saveAccount(req.body);  
        return res.status(201).json(result[0]);         
    }
    return {createAcount};
} 