const db = require("@app/db");
const uuid = require("uuid").v4;
const Op = db.Sequelize.Op;
const crypto = require("crypto");

async function getPermissions(req, res) {
  let where = {};
  if (!req.body.start) req.body.start = 0
  if (!req.body.limit) req.body.limit = 25
  if (req.body.filter)
    where = { [req.body.filter.property]: [req.body.filter.value] };
  let roles = await db.role.findAndCountAll({
    where,
    attributes: req.body.fields,
    offset: req.body.start,
    limit: req.body.limit,
    order: req.body.order ? [req.body.order.field, req.body.order.dir] : null,
    raw: true
  });
  return res.send(roles);
}

async function updatePermissions(req, res) {
  try {
    let ins = {
      id: req.body.id,
      ctime: req.body.ctime,
      name: req.body.name,
      modules: req.body.permissions_array
    };
    if (!ins.id) ins.id = uuid();
    let result = await db.role.upsert(ins);
    if (result) return res.send({ success: true });
  } catch (e) {
    console.log(
      "Jasper report. User controller. updatePermissions func error",
      e
    );
    return res.send({ code: "UPDATEPERMISSIONERROR" });
  }
}

async function removePermission(req, res) {
  if (await db.role.destroy({ where: { id: req.body.id } }))
    return res.send({ success: true });
  return res.send({ success: false });
}

async function getUsers(req, res) {
  let where = {};
  if (req.body.filter)
    where = { [req.body.filter.property]: [req.body.filter.value] };
  let innerUsers = await db.user.findAndCountAll({
    where,
    attributes: req.body.fields,
    offset: req.body.start,
    limit: req.body.limit,
    order: req.body.order ? [req.body.order.field, req.body.order.dir] : null,
    raw: true
  });
  for (let user of innerUsers.rows) delete user.password;

  return res.send(innerUsers);
}

async function updateUsers(req, res) {
  try {
    let where = { login: req.body.login };
    if (req.body.id) where.id = { [Op.ne]: req.body.id };
    let existing_user = await db.user.findOne({
      where,
      attributes: ["id"]
    });
    if (existing_user && existing_user.get("id"))
      return res.send({
        code: "LOGINMUSTBEUNIQUE",
        message: "Login must be unique"
      });
    req.body.password = crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("base64");
    if (!req.body.id) req.body.id = uuid();
    await db.user.upsert({ ...req.body });
    return res.send({ success: true });
  } catch (e) {
    console.log("Jasper report. User controller. updateUsers func. ", e);
    return res.send({ code: "UPDATEUSERERROR" });
  }
}

async function removeUser(req, res) {
  await db.user.destroy({ where: { id: req.body.id } });
  return res.send({ success: true });
}

async function blockUser(req, res) {
  if (
    await db.user.update(
      { block: req.body.action == "block" ? true : false },
      { where: { id: req.body.id } }
    ))
    return res.send({ success: true });
  return res.send({ success: false });
}

module.exports = {
  getPermissions,
  updatePermissions,
  removePermission,
  getUsers,
  updateUsers,
  removeUser,
  blockUser
};
