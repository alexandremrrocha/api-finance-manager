module.exports = (app: any) =>{
    app.route('/users')
        .get(app.routes.users.findAll)
        .post(app.routes.users.createUser)
}