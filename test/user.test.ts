import app from '../src/app';

const request = require('supertest');

test('Should list all users', async () =>{
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('name', 'John Doe');
});

test('Should insert users with sucess', async () =>{
    const res = await request(app).post('/users')
        .send({name: 'Walter Mitty', email: 'walter@email.com'});
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Walter Mitty');
});