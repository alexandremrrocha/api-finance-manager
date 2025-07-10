module.exports = (app: any) =>{
    app.route('/auth/signin').post(app.routes.auth.signin);

    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(app.routes.users.getUsers)
        .post(app.routes.users.createUser);

    app.route('/accounts')
        .all(app.config.passport.authenticate())
        .get(app.routes.accounts.getAll)
        .post(app.routes.accounts.createAcount);

    app.route('/accounts/:id')
        .all(app.config.passport.authenticate())
        .get(app.routes.accounts.getById)
        .put(app.routes.accounts.updateById)
        .delete(app.routes.accounts.removeById);
        
}