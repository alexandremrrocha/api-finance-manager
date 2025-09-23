import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("transactions").del();
    await knex("transfers").del();
    await knex("accounts").del();
    await knex("users").del();

    await knex('users').insert([
        {id: 10000, name: "User #1", email: "user1@email.com.br", password: '$2b$10$QUn7Y8Rt8RLqUhaTTlzOvu.1qDX7qBR3NLQ7qCE0mqGhhT8g9LBn2'},
        {id: 10001, name: "User #2", email: "user2@email.com.br", password: '$2b$10$QUn7Y8Rt8RLqUhaTTlzOvu.1qDX7qBR3NLQ7qCE0mqGhhT8g9LBn2'},
    ]);
    await knex('accounts').insert([
        {id: 10000, name: "AccO #1", user_id: 10000},
        {id: 10001, name: "AccD #1", user_id: 10000},
        {id: 10002, name: "AccO #2", user_id: 10001},
        {id: 10003, name: "AccD #2", user_id: 10001},
    ]);
    await knex('transfers').insert([
        { id: 10000, description: 'Transfer #1', user_id: 10000, acc_ori_id: 10000, acc_dest_id: 10001, ammount: 100, date: new Date()},
        { id: 10001, description: 'Transfer #2', user_id: 10001, acc_ori_id: 10002, acc_dest_id: 10003, ammount: 100, date: new Date()},
    ]);
    await knex('transactions').insert([
        { description: 'Transfer from AccO #1', date: new Date(), ammount: 100, type: 'I', acc_id: 10001, transfer_id: 10000},
        { description: 'Transfer to AccD #1', date: new Date(), ammount: -100, type: 'O', acc_id: 10000, transfer_id: 10000},
        { description: 'Transfer from AccO #2', date: new Date(), ammount: 100, type: 'I', acc_id: 10003, transfer_id: 10001},
        { description: 'Transfer to AccD #2', date: new Date(), ammount: -100, type: 'O', acc_id: 10002, transfer_id: 10001},
    ]);
    
};
