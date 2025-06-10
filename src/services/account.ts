module.exports = (app: any) =>{
    const saveAccount = (account: any) =>{
        return app.db('accounts').insert(account, '*')
    }
    return {saveAccount}
}