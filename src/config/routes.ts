module.exports = (app: any) =>{
    app.route('/users')
        .get(app.routes.users.getUsers)
        .post(app.routes.users.createUser)
}