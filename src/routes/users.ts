module.exports = (app: any) =>{
    const getUsers = async (req: any, res: any)  =>{
        const result: any[] = await app.services.user.findUsers();
        res.status(200).json(result); 
    };

    const createUser = async (req: any, res: any) =>{
        const result = await app.services.user.saveUser(req.body);
        if(result.error){
            return res.status(400).json(result);
        }
        res.status(201).json(result[0]);
    }
    return {getUsers, createUser};
}

