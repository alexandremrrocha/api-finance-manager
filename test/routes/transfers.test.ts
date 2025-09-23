import app from '../../src/app';
import request from 'supertest';
import * as jwt from 'jwt-simple';

const MAIN_ROUTE = '/v1/transfers'
const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTg2NSwibmFtZSI6IldhbHRlciIsInBhc3N3b3JkIjoiJDJiJDEwJGNDVjBvdVBZSERPb2k2ZENueHEwN2VEM2c1WGFMLzVXUFozbVRsZmE3Ri5oVTJRN0ZET21pIn0.l97sL8clOFfGlF3n9zyvi9Hgcv4kHVUnv_aHUDtzl-k'

test('Should list just the user transfers', async () =>{
    const res = await request(app).get(MAIN_ROUTE)
        .set('authorization', `bearer ${TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].description).toBe('Transfers #1');

});