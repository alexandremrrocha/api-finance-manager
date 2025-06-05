module.exports = (app: any) =>{
    const findAll = () =>{
        return app.db('users').select();
    };
    
    const saveUser = (user: any) =>{
        if(!user.name){
            return {error: 'Nome é um atributo obrigatório'};
        }    
        if(!user.password){
            return {error: 'Senha é um atributo obrigatório'};
        }  
        if(!user.email){
            return {error: 'Email é um atributo obrigatório'};
        }         
        return app.db('users').insert(user, '*');
    };

    return {findAll, saveUser};
}