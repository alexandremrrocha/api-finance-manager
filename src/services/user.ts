import bcrypt from 'bcrypt';
import { ValidationError } from '../errors/ValidationError';

module.exports = (app: any) =>{
    const findAll = () =>{
        return app.db('users').select(['id', 'name', 'email']);
    };

    const findUser = (filter = {}) =>{
        return app.db('users').where(filter).first();
    };

    const getPasswordHash = (password: string) =>{
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
    
    const saveUser = async (user: any) =>{
        if(!user.name){
            throw new ValidationError('Nome é um atributo obrigatório');
        }    
        if(!user.password){
             throw new ValidationError('Senha é um atributo obrigatório');
        }  
        if(!user.email){
             throw new ValidationError('Email é um atributo obrigatório');
        }
        
        const userDb = await findUser({email: user.email}); 
        if(userDb){
             throw new ValidationError('Já existe um usuário com esse email');
        }
        
        const newUser = {...user};
        newUser.password = getPasswordHash(user.password);
        return app.db('users').insert(newUser, ['id', 'name', 'email']);
    };

    return {findUser, saveUser, findAll};
}