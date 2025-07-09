import app from '../../src/app';

const request = require('supertest');

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

afterAll(async () => {
  await app.db.destroy(); 
});