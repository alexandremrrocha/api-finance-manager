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
        return app.db('transactions')
            .insert(transaction, '*');
    }

    const update = (transaction: any, filter: any) =>{
        return app.db('transactions')            
            .where(filter)
            .update(transaction, '*');
    }

    const remove = (filter: any) =>{
        return app.db('transactions')            
            .where(filter)
            .delete();
    }

    return {find, findOne, save, update, remove};
}