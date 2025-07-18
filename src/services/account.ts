module.exports = (app: any) =>{

    const findByUserId = (user_id: any) =>{
        return app.db('accounts').where({user_id});
    };

    const find = (filter = {}) =>{
        return app.db('accounts').where(filter).first();
    };

    const saveAccount = async (account: any) =>{
        if(!account.name){
            throw new Error('Nome é um atributo obrigatório');
        }
        if(await find({name: account.name, user_id: account.user_id})){
            throw new Error('Já existe uma conta com esse nome');
        }      
        return app.db('accounts').insert(account, '*')
    }

    const updateById = (id: any, account: any) =>{
        return app.db('accounts').where({id}).update(account, '*');
    };

    const removeById = (id: any) =>{
        return app.db('accounts').where({id}).delete();
    };

    return {saveAccount, find, updateById, removeById, findByUserId}
}