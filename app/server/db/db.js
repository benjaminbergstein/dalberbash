const redis = require('redis');
const { promisify } = require('util');

const key = (...parts) => parts.join(':');

const p = (tgt, method) => promisify(tgt[method]).bind(tgt);
const redisHost = process.env.REDIS_HOST || 'localhost';
const getConnection = () => {
  const client = redis.createClient(6379, redisHost);
  const get = p(client, 'get');
  const set = p(client, 'set');
  const flushdb = p(client, 'flushdb');
  const addToSet = p(client, 'sadd');
  const getSetMembers = p(client, 'smembers');
  const getType = (type) => (id) => get(key(type, id));
  const setType = (type, cb) => (id, data) =>
    set(key(type, id), data).then((res) => {});

  return {
    flushdb,
    client, key,
    get, set,
    getType, setType,
    addToSet, getSetMembers,
  };
};

module.exports = { getConnection };
