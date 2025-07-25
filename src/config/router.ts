import express from "express";

module.exports = (app: any) =>{
    app.use('/auth', app.routes.auth);
    
    const protectedRouter = express.Router();    
    protectedRouter.use('/users', app.routes.users);
    protectedRouter.use('/accounts', app.routes.accounts);

    app.use('/v1', app.config.passport.authenticate(), protectedRouter);
};