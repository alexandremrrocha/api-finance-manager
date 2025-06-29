module.exports = (app: any) =>{
    app.route('/users')
        .get(app.routes.users.getUsers)
        .post(app.routes.users.createUser);

    app.route('/accounts')
        .get(app.routes.accounts.getAll)
        .post(app.routes.accounts.createAcount);

    app.route('/accounts/:id')
        .get(app.routes.accounts.getById)
        .put(app.routes.accounts.updateById)
        .delete(app.routes.accounts.removeById);
        
}