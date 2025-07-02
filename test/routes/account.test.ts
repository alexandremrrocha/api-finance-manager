import app from '../../src/app';

const request = require('supertest');

const MAIN_ROUTE: string = '/accounts';
let user: any;

beforeAll(async () =>{
    const res = await app.services.user.saveUser({name: 'User Account', email: `${Date.now()}@email.com`, password: '123456'});
    user = {...res[0]};
});

test('Should insert account with success', async () =>{
    const res = await request(app).post(MAIN_ROUTE).send({name: '#Account 1', user_id: user.id});
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('#Account 1');
});

test('It shouldnt insert an account without a name', async() =>{
    const res = await request(app).post(MAIN_ROUTE).send({user_id: user.id});
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Nome é um atributo obrigatório');
});

test.skip('It shouldnt insert an account with duplicate name for the same user', async () =>{});

test('Should list all accounts', async () =>{
    await app.db('accounts').insert({name: 'Acc list', user_id: user.id});
    const res = await request(app).get(MAIN_ROUTE);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
});

test.skip('It should list just the user account', async () =>{});

test('Should return a account for Id', async () =>{
    const resultInsert = await app.db('accounts').insert({name: 'Acc by id', user_id: user.id}, ['id']);
    const res = await request(app).get(`${MAIN_ROUTE}/${resultInsert[0].id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Acc by id');
    expect(res.body.user_id).toBe(user.id);
});

test.skip('It shouldnt return an account of another user', async () =>{});

test('Should alter an account', async () =>{
    const insertAccount = await app.db('accounts').insert({name: 'Acc to Update', user_id: user.id}, ['id']);    
    const updateAccount = await request(app).put(`${MAIN_ROUTE}/${insertAccount[0].id}`)  
        .send({name: 'Acc Updated'});    
    expect(updateAccount.status).toBe(200);
    expect(updateAccount.body.name).toBe('Acc Updated');
});

test.skip('It shouldnt alter an account of another user', async () =>{});

test('It should delete an account', async () =>{
    const insertAccount = await app.db('accounts').insert({name: 'Acc to Delete', user_id: user.id}, ['id']);
    const deleteAccount = await request(app).delete(`${MAIN_ROUTE}/${insertAccount[0].id}`);
    expect(deleteAccount.status).toBe(204);
});

test.skip('It shouldnt delete an account of another user', async () =>{});

afterAll(async () => {
  await app.db.destroy(); 
});