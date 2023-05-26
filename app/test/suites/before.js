const db = require("@app/db");
import redis from "@app/redis";

global.testScope = {};

before(async () => {
  console.log("IN BEFORE");
  await redis.flushAll();
  testScope.value = "some";
  await db.client.truncate({ cascade: true });
});
