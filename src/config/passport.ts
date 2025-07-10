import passport from 'passport'
import passportJwt from 'passport-jwt'

const { Strategy, ExtractJwt } = passportJwt;

const secret = 'textoseguro'

module.exports = (app: any) =>{
    const params = {
        secretOrKey: secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };

    const strategy = new Strategy(params, async (payload, done) =>{
        try {
            const user = await app.services.user.findUser({id: payload.id})
            if(!user){
                done(null, false);                
            }
            done(null, {...payload});
        } catch (error) {
            done(error, false);
        }        
    });

    passport.use(strategy);

    return {
        authenticate: () => passport.authenticate('jwt', {session: false})
    }
}