module.exports = (app: any) =>{
    const findUsers = (filter = {}) =>{
        return app.db('users').where(filter).select();
    };
    
    const saveUser = async (user: any) =>{
        if(!user.name){
            throw new Error('Nome é um atributo obrigatório');
        }    
        if(!user.password){
             throw new Error('Senha é um atributo obrigatório');
        }  
        if(!user.email){
             throw new Error('Email é um atributo obrigatório');
        }
        
        const userDb = await findUsers({email: user.email}); 
        if(userDb && userDb.length > 0){
             throw new Error('Já existe um usuário com esse email');
        }
        
        return app.db('users').insert(user, '*');
    };

    return {findUsers, saveUser};
}