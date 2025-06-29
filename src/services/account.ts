module.exports = (app: any) =>{

    const saveAccount = (account: any) =>{
        if(!account.name){
            return {error: 'Nome é um atributo obrigatório'};
        }            
        return app.db('accounts').insert(account, '*')
    }

    const getAll = () =>{
        return app.db('accounts');
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

    return {saveAccount, getAll, find, updateById, removeById}
}