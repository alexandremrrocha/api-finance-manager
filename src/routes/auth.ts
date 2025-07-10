import * as jwt from 'jwt-simple';
import bcrypt from 'bcrypt';

const secret = 'textoseguro'

module.exports = (app: any) =>{
    const signin = async (req: any, res: any, next: any) => {        
        try {
            const user = await app.services.user.findUser({ email: req.body.email });            
            if(!user){
                throw new Error('Usuário ou senha incorreta');
            }
            if(bcrypt.compareSync(req.body.password, user.password)){
                const payload = {
                    id: user.id,
                    name: user.name,
                    password: user.password,
                };
                const token = jwt.encode(payload, secret);
                return res.status(200).json({ token });
            }else{                
                throw new Error('Usuário ou senha incorreta');
            }            
        } catch (error) {
            next(error);
        }                
    };

    return {signin};
};