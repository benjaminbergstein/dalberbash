const { getConnection } = require('./db.js');
const { promisify } = require('util');

const { client, flushdb } = getConnection();

flushdb().then(() => {
  console.log("Redis DB flushed.");
  client.quit();
});
