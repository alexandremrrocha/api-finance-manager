import app from '../src/app';

const request = require ('supertest');

test('Should respond on the root', async () => {
  const res = await request(app).get('/');
  expect(res.status).toBe(200);
});
