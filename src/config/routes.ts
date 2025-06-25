module.exports = (app: any) =>{
    app.route('/users')
        .get(app.routes.users.getUsers)
        .post(app.routes.users.createUser);

    app.route('/accounts')
        .get(app.routes.accounts.getAll)
        .post(app.routes.accounts.createAcount)
}