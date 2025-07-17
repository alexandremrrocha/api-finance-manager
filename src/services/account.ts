module.exports = (app: any) =>{

    const saveAccount = (account: any) =>{
        if(!account.name){
            throw new Error('Nome é um atributo obrigatório');
        }            
        return app.db('accounts').insert(account, '*')
    }

    const findByUserId = (user_id: any) =>{
        return app.db('accounts').where({user_id});
    };

    const find = (filter = {}) =>{
        return app.db('accounts').where(filter).first();
    };

    const updateById = (id: any, account: any) =>{
        return app.db('accounts').where({id}).update(account, '*');
    };

    const removeById = (id: any) =>{
        return app.db('accounts').where({id}).delete();
    };

    return {saveAccount, find, updateById, removeById, findByUserId}
}