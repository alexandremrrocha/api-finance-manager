import app from '../../src/app';
import request from 'supertest';

test('Should create a user through signup', async () =>{
  const res = await request(app).post('/auth/signup').send({ name: 'Walter', email: `${Date.now()}@email.com`, password: '123456'});
  expect(res.status).toBe(201);
  expect(res.body.name).toBe('Walter');
  expect(res.body).toHaveProperty('email');
  expect(res.body).not.toHaveProperty('password');
});

test('Should receive token to login', async() =>{
    const payload: Record<string, any> = {
        name: 'Walter',
        email: `${Date.now()}@email.com`,
        password: '123456'
    };
    
    await app.services.user.saveUser(payload);
    const res = await request(app).post('/auth/signin').send({email: payload.email, password: payload.password});
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
});

test('Shouldnt authenticate user with wrong password', async () => {
  const payload: Record<string, any> = {
        name: 'Walter',
        email: `${Date.now()}@email.com`,
        password: '123456'
    };
    
    await app.services.user.saveUser(payload);
    const res = await request(app).post('/auth/signin').send({email: payload.email, password: '654321'});
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Usuário ou senha incorreta');
});

test('Shouldnt authenticate user who doesnt exist', async () => {      
    const res = await request(app).post('/auth/signin').send({email: 'nãoExiste@email.com', password: '654321'});
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Usuário ou senha incorreta');
});

test('Shouldnt access a protected route without a token', async () =>{
  const res = await request(app).get('/v1/users');
  expect(res.status).toBe(401);
});

afterAll(async () => {
  await app.db.destroy(); 
});