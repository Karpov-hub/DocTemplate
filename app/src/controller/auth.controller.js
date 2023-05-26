const db = require("@app/db");
const crypto = require("crypto");
const redis = require("@app/redis");
const config = require("@app/config");

async function signin(req, res) {
  let user = await db.user.findOne({
    where: { login: req.body.login },
    attributes: ["id", "login", "password", "block"]
  });
  if (!user)
    return res.send({ code: "AUTHENTICATIONFAILED" });
  if (user.get("block"))
    return res.send({ code: "USERBLOCKED", message: "User blocked" });
  if (
    crypto.createHash("sha256").update(req.body.password).digest("base64") ==
    user.get("password")
  ) {
    let token = crypto.randomBytes(30).toString("base64");
    await redis.set(token, user.get("id"), config.token_lifetime);
    return res.send({ token });
  } else return res.send({ code: "AUTHENTICATIONFAILED" });
}

async function refreshToken(req, res) {
  if (await redis.get(req.body.token))
    return res.send({ success: true });
  return res.send({ success: false });
}

async function getUserData(req, res) {
  let user = await db.user.findOne({
    where: { id: await redis.get(req.body.token) },
    attributes: ["login", "first_name", "last_name", "middle_name", "role", "su"]
  });
  if (!user) return res.send({ code: "USERNOTFOUND" });
  if (user.get("su"))
    return res.send({
      user_data: {
        first_name: user.get("first_name"),
        last_name: user.get("last_name"),
        middle_name: user.get("middle_name"),
        login: user.get("login")
      },
      su: true
    });

  if (!user.get("role")) return res.send({ code: "ROLENOTFOUND" });
  let role = await db.role.findOne({
    where: { id: user.get("role") },
  });

  if (!role.get("modules")) {
    return res.send({ code: "ROLENOTFOUND" });
  }

  return res.send({
    user_data: {
      first_name: user.get("first_name"),
      last_name: user.get("last_name"),
      middle_name: user.get("middle_name"),
      login: user.get("login")
    },
    permissions: role.get("modules"),
  });
}

async function logout(req, res) {
  if (req.body.token) {
    if (await redis.get(req.body.token)) {
      await redis.del(req.body.token);
      return res.send({ success: true });
    }
  }
  return res.send({ success: false });
}

module.exports = {
  signin,
  getUserData,
  refreshToken,
  logout
};
