const jwt = require ('jwt-simple');
import bcrypt from 'bcrypt';

const secret = 'textoseguro'

module.exports = (app: any) =>{
    const signin = async (req: any, res: any, next: any) => {        
        try {
            const user = await app.services.user.findUser({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ error: 'Usuário não encontrado' });
            }

            const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Senha inválida' });
            }

            const payload = {
                id: user.id,
                name: user.name,
                password: user.password,
            };
            const token = jwt.encode(payload, secret);
            return res.status(200).json({ token });
        } catch (error) {
            next(error);
        }                
    };

    return {signin};
};