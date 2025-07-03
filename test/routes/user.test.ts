import app from '../../src/app';

const request = require('supertest');
const email: string = `${Date.now()}@email.com`;

test('Should list all users', async () =>{
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    
});

test('Should insert users with sucess', async () =>{    
    const res = await request(app).post('/users')
        .send({name: 'Walter Mitty', email, password: '123456'});
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Walter Mitty');
    expect(res.body).not.toHaveProperty('password');
});

test('Should insert encrypted password', async () =>{ 
    const res = await request(app).post('/users')
        .send({name: 'Walter Mitty', email: `${Date.now()}@email.com`, password: '123456'});
    expect(res.status).toBe(201);

    const {id} = res.body;
    const userDb = await app.services.user.findUser({id});
    expect(userDb.password).not.toBeUndefined();
    expect(userDb.password).not.toBe('123456');
});

test(`Shouldn't insert users without a name`, async () =>{
    const res = await request(app).post('/users')
        .send({email, password:'testeSemNome'});
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Nome é um atributo obrigatório')      
});

test(`Shouldn't insert users without a email`, async () =>{
    const res = await request(app).post('/users')
        .send({name: 'Walter Mitty', password: '123456'});
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Email é um atributo obrigatório')      
});

test(`Shouldn't insert users without a password`, async () =>{
    const res = await request(app).post('/users')
        .send({name: 'Walter Mitty', email});
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Senha é um atributo obrigatório')      
});

test(`Shouldn't insert users with existing email addresses`, async () =>{
    const res = await request(app).post('/users')
        .send({name: 'Walter Mitty', email, password: '123456'});
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Já existe um usuário com esse email');
});

afterAll(async () => {
  await app.db.destroy(); 
});