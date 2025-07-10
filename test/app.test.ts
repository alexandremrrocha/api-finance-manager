import app from '../src/app';
import request from 'supertest';

test('Should respond on the root', async () => {
  const res = await request(app).get('/');
  expect(res.status).toBe(200);
});
