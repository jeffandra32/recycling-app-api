import knex from 'knex';
import path from 'path';

const connection = knex({
  client: 'mysql2',
  // connection: {
  //   filename: path.resolve(__dirname, 'database.sqlite'),
  // }
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '2309',
    database : 'recycling-app'
  }
});

export default connection;
