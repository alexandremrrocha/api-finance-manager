import { ValidationError } from "../errors/ValidationError";

module.exports = (app: any) => {

    const find = (userId: number, filter = {}) =>{
        return app.db('transactions')
            .join('accounts', 'accounts.id', 'acc_id')
            .where(filter)
            .andWhere('accounts.user_id', '=', userId)
            .select();
    }

    const findOne = (filter: any) =>{
        return app.db('transactions')            
            .where(filter)
            .first();
    }

    const save = (transaction: any) => {
        if(!transaction.description){
            throw new ValidationError('Descrição é um atributo obrigatório');
        }
        if(!transaction.ammount){
            throw new ValidationError('Valor é um atributo obrigatório');
        }
        if(!transaction.date){
            throw new ValidationError('Data é um atributo obrigatório');
        }
        if(!transaction.acc_id){
            throw new ValidationError('Conta é um atributo obrigatório');
        }
        if(!transaction.type){
            throw new ValidationError('Tipo é um atributo obrigatório');
        }
        if(!(transaction.type === 'I' || transaction.type === 'O')){
            throw new ValidationError('Tipo inválido');
        }
        const newTransaction = {...transaction};
        if((transaction.type == 'I' && transaction.ammount < 0) || 
            (transaction.type == 'O' && transaction.ammount > 0)){
            newTransaction.ammount *= -1;                
        }
        return app.db('transactions')
            .insert(newTransaction, '*');
    }

    const update = (transaction: any, filter: any) =>{
        return app.db('transactions')            
            .where(filter)
            .update(transaction, '*');
    }

    const remove = async (id: number) =>{       
        return app.db('transactions')            
            .where({ id })
            .delete();
    }

    return {find, findOne, save, update, remove};
}