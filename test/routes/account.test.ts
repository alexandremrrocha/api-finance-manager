import app from '../../src/app';
import request from 'supertest';
import * as jwt from 'jwt-simple';

const MAIN_ROUTE: string = '/v1/accounts';
let user: any;
let user2: any;

beforeEach(async () =>{
    const res = await app.services.user.saveUser({name: 'User Account #1', email: `${Date.now()}@email.com`, password: '123456'});
    user = {...res[0]};
    user.token = jwt.encode(user, 'textoseguro');
    const res2 = await app.services.user.saveUser({name: 'User Account #2', email: `${Date.now()}@email.com`, password: '123456'});
    user2 = {...res2[0]};
    
});

test('Should insert account with success', async () =>{
    const res = await request(app).post(MAIN_ROUTE)
        .send({name: '#Account 1'})
        .set('authorization', `bearer ${user.token}`);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('#Account 1');
});

test('It shouldnt insert an account without a name', async() =>{
    const res = await request(app).post(MAIN_ROUTE)
        .send({})
        .set('authorization', `bearer ${user.token}`);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Nome é um atributo obrigatório');
});

test('It shouldnt insert an account with duplicate name for the same user', async () =>{
    await app.db('accounts').insert({name: "Account duplicada", user_id: user.id});
    const res = await request(app)
        .post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({name: "Account duplicada"});
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Já existe uma conta com esse nome');
});

test('It should list just the user account', async () =>{ 
    await app.db('accounts').insert([
       { name: 'Account User #1', user_id: user.id },
       { name: 'Account User #2', user_id: user2.id },
    ]);
    const res = await request(app)
        .get(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Account User #1');
});

test('Should return a account for Id', async () =>{
    const resultInsert = await app.db('accounts').insert({name: 'Acc by id', user_id: user.id}, ['id']);
    const res = await request(app)
        .get(`${MAIN_ROUTE}/${resultInsert[0].id}`)
        .set('authorization', `bearer ${user.token}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Acc by id');
    expect(res.body.user_id).toBe(user.id);
});

test('It shouldnt return an account of another user', async () =>{
    const account = await app.db('accounts').insert({name: "Acc User #2", user_id: user2.id}, ['id']);
    const res = await request(app)
        .get(`${MAIN_ROUTE}/${account[0].id}`)
        .set('authorization', `bearer ${user.token}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Este recurso não pertence ao usuário');    
});

test('Should alter an account', async () =>{
    const insertAccount = await app.db('accounts').insert({name: 'Acc to Update', user_id: user.id}, ['id']);    
    const updateAccount = await request(app)
        .put(`${MAIN_ROUTE}/${insertAccount[0].id}`)  
        .send({name: 'Acc Updated'})
        .set('authorization', `bearer ${user.token}`);    
    expect(updateAccount.status).toBe(200);
    expect(updateAccount.body.name).toBe('Acc Updated');
});

test.skip('It shouldnt alter an account of another user', async () =>{});

test('It should delete an account', async () =>{
    const insertAccount = await app.db('accounts').insert({name: 'Acc to Delete', user_id: user.id}, ['id']);
    const deleteAccount = await request(app)
        .delete(`${MAIN_ROUTE}/${insertAccount[0].id}`)
        .set('authorization', `bearer ${user.token}`);
    expect(deleteAccount.status).toBe(204);
});

test.skip('It shouldnt delete an account of another user', async () =>{});

afterAll(async () => {
  await app.db.destroy(); 
});