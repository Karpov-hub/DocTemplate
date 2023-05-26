const redis = require("redis");
const config = require("@app/config");
const client = config.redis
  ? redis.createClient(config.redis)
  : redis.createClient();

async function get(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

async function set(key, value, lifetime = 3000) {
  return new Promise((resolve, reject) => {
    client.set(key, value, "EX", lifetime, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

async function del(key) {
  return new Promise((resolve, reject) => {
    client.del(key, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

async function flushAll() {
  return new Promise((resolve, reject) => {
    client.FLUSHALL((err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

async function keys(pattern) {
  return new Promise((resolve, reject) => {
    client.KEYS(pattern, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

module.exports = {
  get,
  set,
  del,
  keys,
  flushAll
};
