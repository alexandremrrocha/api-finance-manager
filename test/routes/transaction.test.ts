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

afterAll(async () => {
  await app.db.destroy(); 
});