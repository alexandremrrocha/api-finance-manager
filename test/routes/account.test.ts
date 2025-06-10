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

afterAll(async () => {
  await app.db.destroy(); 
});