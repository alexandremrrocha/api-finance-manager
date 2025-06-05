module.exports = (app: any) =>{
    const findUsers = (filter = {}) =>{
        return app.db('users').where(filter).select();
    };
    
    const saveUser = async (user: any) =>{
        if(!user.name){
            return {error: 'Nome é um atributo obrigatório'};
        }    
        if(!user.password){
            return {error: 'Senha é um atributo obrigatório'};
        }  
        if(!user.email){
            return {error: 'Email é um atributo obrigatório'};
        }
        
        const userDb = await findUsers({email: user.email}); 
        if(userDb && userDb.length > 0){
            return {error: 'Já existe um usuário com esse email'}
        }
        
        return app.db('users').insert(user, '*');
    };

    return {findUsers, saveUser};
}