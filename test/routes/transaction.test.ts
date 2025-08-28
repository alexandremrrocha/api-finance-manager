import app from '../../src/app';
import request from 'supertest';
import * as jwt from 'jwt-simple';

const MAIN_ROUTE = '/v1/transactions'
let user: any;
let user2: any;
let accountUser: any;
let accountUser2: any;

beforeAll(async () => {
    await app.db('transactions').del();
    await app.db('accounts').del();
    await app.db('users').del();
    
    const users =await app.db('users').insert([
        {name: 'User #1', email: 'user@email.com', password: '$2b$10$QUn7Y8Rt8RLqUhaTTlzOvu.1qDX7qBR3NLQ7qCE0mqGhhT8g9LBn2'},
        {name: 'User #2', email: 'user2@email.com', password: '$2b$10$QUn7Y8Rt8RLqUhaTTlzOvu.1qDX7qBR3NLQ7qCE0mqGhhT8g9LBn2'}
    ], '*');
    [user, user2] = users;
    delete user.password;
    user.token = jwt.encode(user, 'textoseguro');

    const accounts = await app.db('accounts').insert([
        {name: 'Account #1', user_id: user.id},
        {name: 'Account #2', user_id: user2.id},
    ], '*');
    [accountUser, accountUser2] = accounts;
});

test('Should list only the user transactions', async () =>{
    await app.db('transactions').insert([
        {description: "T1", date: new Date(), ammount: 100, type: 'I', acc_id: accountUser.id},
        {description: "T2", date: new Date(), ammount: 300, type: 'O', acc_id: accountUser2.id},
    ]);

    const res =await request(app).get(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].description).toBe('T1');
});

test('Should insert a transaction with success', async () =>{
    const res = await request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({description: 'New T', date: new Date(), ammount: 100, type: 'I', acc_id: accountUser.id});
    expect(res.status).toBe(201);
    expect(res.body.acc_id).toBe(accountUser.id);
});

test('Input transactions should be positive', async () =>{
    const res = await request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({description: 'New T', date: new Date(), ammount: -100, type: 'I', acc_id: accountUser.id});
    expect(res.status).toBe(201);
    expect(res.body.acc_id).toBe(accountUser.id);
    expect(res.body.ammount).toBe('100.00');
});

test('Output transactions should be positive', async () =>{
    const res = await request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({description: 'New T', date: new Date(), ammount: 100, type: 'O', acc_id: accountUser.id});
    expect(res.status).toBe(201);
    expect(res.body.acc_id).toBe(accountUser.id);
    expect(res.body.ammount).toBe('-100.00');
});

describe('Try insert an invalid transaction', () =>{
    let validTransaction: any;
    beforeAll(() => {
        validTransaction = {description: 'New T', date: new Date(), ammount: 100, type: 'I', acc_id: accountUser.id};
    });

    const testTemplate = async (newData: any, errorMessage: string) =>{
        const res = await request(app).post(MAIN_ROUTE)
            .set('authorization', `bearer ${user.token}`)
            .send({...validTransaction, ...newData}); 
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(errorMessage);
    };

    test('Shouldnt insert without description', () =>{
        testTemplate({description: null}, 'Descrição é um atributo obrigatório')
    });

    test('Shouldnt insert a transaction without value', () =>{
        testTemplate({ammount: null}, 'Valor é um atributo obrigatório')            
    });

    test('Shouldnt insert a transaction without date', () =>{
        testTemplate({date: null}, 'Data é um atributo obrigatório')            
    });

    test('Shouldnt insert a transaction without account', () =>{
        testTemplate({acc_id: null}, 'Conta é um atributo obrigatório')                    
    });

    test('Shouldnt insert a transaction without type', () =>{
        testTemplate({type: null}, 'Tipo é um atributo obrigatório')            
    });

    test('Shouldnt insert a transaction with type invalid', () =>{
        testTemplate({type: 'A'}, 'Tipo inválido')            
    });
});

test('Should return a transaction by ID', async () =>{
    const resTransactionInsert = await app.db('transactions')
        .insert({description: 'T ID', date: new Date(), ammount: 100, type: 'I', acc_id: accountUser.id}, ['id']);
    const resGetTransaction: any = await request(app).get(`${MAIN_ROUTE}/${resTransactionInsert[0].id}`)
        .set('authorization', `bearer ${user.token}`)
    expect(resGetTransaction.status).toBe(200);
    expect(resGetTransaction.body.id).toBe(resTransactionInsert[0].id);
    expect(resGetTransaction.body.description).toBe('T ID');    
});

test('Should alter a transactions', async () =>{
    const resTransactionInsert = await app.db('transactions')
        .insert({description: 'T update ID', date: new Date(), ammount: 100, type: 'I', acc_id: accountUser.id}, ['id']);
    const resPatchTransaction: any = await request(app).patch(`${MAIN_ROUTE}/${resTransactionInsert[0].id}`)        
        .set('authorization', `bearer ${user.token}`)
        .send({description: "Updated"});
    expect(resPatchTransaction.status).toBe(200);  
    expect(resPatchTransaction.body.description).toBe('Updated');
});

test('Should delete a transaction', async () =>{
    const resTransactionInsert = await app.db('transactions')
        .insert({description: 'T deleted ID', date: new Date(), ammount: 100, type: 'I', acc_id: accountUser.id}, ['id']);
    const resDeletedTransaction: any = await request(app).delete(`${MAIN_ROUTE}/${resTransactionInsert[0].id}`)        
        .set('authorization', `bearer ${user.token}`)
    expect(resDeletedTransaction.status).toBe(204);            
});

test('Shouldnt delete a transaction of another user', async () =>{
    const resTransactionInsert = await app.db('transactions')
        .insert({description: 'T deleted ID', date: new Date(), ammount: 100, type: 'I', acc_id: accountUser2.id}, ['id']);
    const resDeletedTransaction: any = await request(app).delete(`${MAIN_ROUTE}/${resTransactionInsert[0].id}`)        
        .set('authorization', `bearer ${user.token}`)
    expect(resDeletedTransaction.status).toBe(403);    
    expect(resDeletedTransaction.body.message).toBe('Este recurso não pertence ao usuário');        
});

test('Shouldnt remove a account with transaction', async () =>{
    await app.db('transactions')
        .insert({description: 'T deleted ID', date: new Date(), ammount: 100, type: 'I', acc_id: accountUser.id});
    const res: any = await request(app).delete(`/v1/accounts/${accountUser.id}`)        
        .set('authorization', `bearer ${user.token}`)
    expect(res.status).toBe(400); 
    expect(res.body.message).toBe('Essa conta possui transações associadas');
});

afterAll(async () => {
  await app.db.destroy(); 
});