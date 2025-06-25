module.exports = (app: any) =>{
    const saveAccount = (account: any) =>{
        return app.db('accounts').insert(account, '*')
    }

    const getAll = () =>{
        return app.db('accounts');
    };

    const find = (filter = {}) =>{
        return app.db('accounts').where(filter).first();
    };

    return {saveAccount, getAll, find}
}