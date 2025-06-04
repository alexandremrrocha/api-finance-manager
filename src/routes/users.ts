module.exports = (app: any) =>{
    const findAll = async (req: any, res: any)  =>{
        const result: any[] = await app.db('users').select();
        res.status(200).json(result); 
    };

    const createUser = async (req: any, res: any) =>{
        const result: any[] = await app.db('users').insert(req.body, '*');
        res.status(201).json(result[0]);
    }
    return {findAll, createUser};
}

