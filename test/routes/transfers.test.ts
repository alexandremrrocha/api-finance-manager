import app from '../../src/app';
import request from 'supertest';

const MAIN_ROUTE = '/v1/transfers';
const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAwMDAsIm5hbWUiOiJVc2VyICMxIiwiZW1haWwiOiJ1c2VyMUBlbWFpbC5jb20uYnIifQ.LUlok53sWAnSEgjT0IkauC_pxO6pZ86Urj1kwBQsGcA';

const validTransferPayload = {
  description: 'Regular Transfer',
  acc_ori_id: 10000,
  acc_dest_id: 10001,
  ammount: 100,
  date: '2025-01-01',
};

const postTransfer = (payload: any = {}) => {
  return request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`)
    .send({ ...validTransferPayload, ...payload });
};

beforeEach(async () => {
  await app.db.seed.run();
});

test('Should list just the user transfers', async () => {
  const res = await request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0].description).toBe('Transfer #1');
});

test('Should insert a transfer with success', async () => {
  const res = await postTransfer();
  expect(res.status).toBe(201);
  expect(res.body.description).toBe(validTransferPayload.description);
  expect(res.body.user_id).toBe(10000);
});

test('Should create transactions for a transfer', async () => {
  const result = await postTransfer();
  const transactions: any[] = await app
    .db('transactions')
    .where({ transfer_id: result.body.id })
    .orderBy('type');
  expect(transactions).toHaveLength(2);
  const debit = transactions.find((transaction: any) => transaction.type === 'O');
  const credit = transactions.find((transaction: any) => transaction.type === 'I');
  expect(debit).toBeDefined();
  expect(debit.ammount).toBe('-100.00');
  expect(debit.acc_id).toBe(validTransferPayload.acc_ori_id);
  expect(credit).toBeDefined();
  expect(credit.ammount).toBe('100.00');
  expect(credit.acc_id).toBe(validTransferPayload.acc_dest_id);
});

test('Should not allow transfer with origin account from another user', async () => {
  const res = await postTransfer({ acc_ori_id: 10002 });
  expect(res.status).toBe(403);
  expect(res.body.message).toBe('Este recurso não pertence ao usuário');
});

test('Should not allow transfer with destination account from another user', async () => {
  const res = await postTransfer({ acc_dest_id: 10003 });
  expect(res.status).toBe(403);
  expect(res.body.message).toBe('Este recurso não pertence ao usuário');
});

test('Should not allow transfer with same origin and destination accounts', async () => {
  const res = await postTransfer({ acc_dest_id: 10000 });
  expect(res.status).toBe(400);
  expect(res.body.message).toBe('Conta de origem e destino devem ser diferentes');
});

test('Should ignore user_id provided in the payload', async () => {
  const res = await postTransfer({ user_id: 10001 });
  expect(res.status).toBe(201);
  expect(res.body.user_id).toBe(10000);
});

describe('Transfer creation validation', () => {
  const template = async (newData: any, errorMessage: string) => {
    const res = await postTransfer(newData);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(errorMessage);
  };

  test('Should not insert without description', async () => {
    await template({ description: null }, 'Descricao e um atributo obrigatorio');
  });

  test('Should not insert without amount', async () => {
    await template({ ammount: null }, 'Valor e um atributo obrigatorio');
  });

  test('Should not insert without date', async () => {
    await template({ date: null }, 'Data e um atributo obrigatoria');
  });

  test('Should not insert without origin account', async () => {
    await template({ acc_ori_id: null }, 'Conta de origem e um atributo obrigatorio');
  });

  test('Should not insert without destination account', async () => {
    await template({ acc_dest_id: null }, 'Conta de destino e um atributo obrigatorio');
  });

  test('Should not accept zero amount', async () => {
    await template({ ammount: 0 }, 'Valor deve ser positivo');
  });

  test('Should not accept negative amount', async () => {
    await template({ ammount: -100 }, 'Valor deve ser positivo');
  });
});

afterAll(async () => {
  await app.db.destroy();
});
