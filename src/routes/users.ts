module.exports = (app: any) =>{
    const getUsers = async (req: any, res: any)  =>{
        const result: any[] = await app.services.user.findAll();
        res.status(200).json(result); 
    };

    const createUser = async (req: any, res: any, next: any) =>{
        try {
            const result = await app.services.user.saveUser(req.body);
            res.status(201).json(result[0]);
        } catch (error: any) {
            next(error);
        }            
    }
    
    return {getUsers, createUser};
}

