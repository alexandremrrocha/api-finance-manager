import User from "../interface/UserInterface";

module.exports = () =>{
    const findAll = (req: any, res: any) =>{
        const users: User[] = [{
            name: 'John Doe',
            email: 'johndoe@email.com'
        }];
        res.status(200).json(users); 
    };

    const createUser = (req: any, res: any) =>{
        res.status(201).json(req.body);
    }
    return {findAll, createUser};
}

