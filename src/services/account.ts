module.exports = (app: any) =>{
    const saveAccount = (account: any) =>{
        return app.db('accounts').insert(account, '*')
    }

    const getAll = () =>{
        return app.db('accounts');
    }

    return {saveAccount, getAll}
}