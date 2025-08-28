import { ValidationError } from "../errors/ValidationError";

module.exports = (app: any) =>{

    const findByUserId = (user_id: any) =>{
        return app.db('accounts').where({user_id});
    };

    const find = (filter = {}) =>{
        return app.db('accounts').where(filter).first();
    };

    const saveAccount = async (account: any) =>{
        if(!account.name){
            throw new ValidationError('Nome é um atributo obrigatório');
        }
        if(await find({name: account.name, user_id: account.user_id})){
            throw new ValidationError('Já existe uma conta com esse nome');
        }      
        return app.db('accounts').insert(account, '*')
    }

    const updateById = (id: any, account: any) =>{
        return app.db('accounts').where({id}).update(account, '*');
    };

    const removeById = async (id: number) =>{
        const transaction = await app.services.transaction.findOne({acc_id: id});
        if(transaction){
            throw new ValidationError('Essa conta possui transações associadas');
        }
        return app.db('accounts').where({id}).delete();
    };

    return {saveAccount, find, updateById, removeById, findByUserId}
}