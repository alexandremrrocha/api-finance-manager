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

test('Should list all accounts', async () =>{
    await app.db('accounts').insert({name: 'Acc list', user_id: user.id});
    const res = await request(app).get(MAIN_ROUTE);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
});

test('Should return a account for Id', async () =>{
    const resultInsert = await app.db('accounts').insert({name: 'Acc by id', user_id: user.id}, ['id']);
    const res = await request(app).get(`${MAIN_ROUTE}/${resultInsert[0].id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Acc by id');
    expect(res.body.user_id).toBe(user.id);
});

afterAll(async () => {
  await app.db.destroy(); 
});