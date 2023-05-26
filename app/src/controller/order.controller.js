const db = require("@app/db");
const config = require("@app/config");
const redis = require("@app/redis");
const Op = db.Sequelize.Op;
const { _saveTemplate } = require("./jasperService.controller");

async function createOrder(req, res) {
  let client_id = await redis.get("usr" + req.body.session_token);
  let order = {
    client_id: client_id,
    template_name: req.body.template_name,
    requirements: req.body.requirements,
    status: 0,
    operator_id: null,
    note: null,
    ctime: Date.now(),
    template_id: null,
    type: req.body.type,
    attached_files: [],
  };

  if (req.body.attached_files?.length > 0) {
    for (let file of req.body.attached_files) {
      order.attached_files.push(file.code)
    };
  }

  await db.order.create(order).catch((e) => {
    console.log("order creating error: ", e);
    res.send({
      success: false,
      code: "CREATEORDERERROR",
      message: e.message,
    });
  });

  return res.send({ success: true, message: "Order was successfuly created" });
}

async function getOrders(req, res) {
  const searchingOptions = {
    attributes: [
      "id",
      "template_name",
      "status",
      "requirements",
      "attached_files",
      "ctime",
    ],
    include: [
      {
        model: db.client,
        attributes: ["first_name", "last_name", "middle_name"],
      },
    ]
  };

  if (req.body.start) {
    searchingOptions.start = req.body.start
  }
  else {
    searchingOptions.start = 0
  }
  if (req.body.limit) {
    searchingOptions.limit = req.body.limit
  }
  else {
    searchingOptions.limit = 25
  }

  let div = "DESC";
  if (req.body.div) {
    div = req.body.div;
  }
  if (req.body.field != null) {
    searchingOptions.order = [[req.body.field, div]];
  }
  /*
  if (filter.name != null)
  searchingOptions.where = { name: { [Op.like]: `%${filter.name}%` } };
  if (filter.email != null)
  searchingOptions.where = { email: { [Op.like]: `%${filter.email}%` } };
  */

  if (req.body.token) {
    let id = await redis.get(req.body.token);

    if (id) {
      searchingOptions.where = {
        operator_id: id,
        status: { [Op.and]: [{ [Op.ne]: 2 }, { [Op.ne]: 4 }] },
      };
    }
    else {
      searchingOptions.where = { operator_id: null, status: 0 };
    }
  }
  let { count, rows } = await db.order.findAndCountAll(searchingOptions);
  return res.send({ code: "SUCCESS", count, rows });
}

async function applyOrderToOperator(req, res) {
  let id = await redis.get("usr" + req.body.session_token)

  await db.order.update(
    {
      operator_id: id,
      status: 1,
    },
    { where: { id: req.body.order_id } }
  ).catch((e) => {
    console.log("apply order error: ", e);
    res.send({
      success: false,
      code: "APPLYORDERERROR",
      message: e.message,
    });
  });

  return res.send({
    code: "SUCCESS",
    message: "Order was applied to operator",
  });
}

async function changeOrderStatus(req, res) {
  let updatingOptions = {};
  updatingOptions.status = req.body.status;
  if (updatingOptions.status > 2) {
    if (req.body.note == null) {
      return res.send({
        code: "ERROR",
        message: "This status requires a note of reason",
      });
    }
    updatingOptions.note = req.body.note;
  }
  await db.order.update(updatingOptions, { where: { id: req.body.order_id } });
  return res.send({ code: "SUCCESS", message: "Status was changed" });
}

async function completeOrder(req, res) {
  try {
    let clientNtype = await db.order.findOne({
      attributes: ["client_id", "type"],
      where: { id: req.body.order_id },
    });
    let saving_request = { ...req };
    saving_request.body.client_id = clientNtype.client_id;
    saving_request.body.type = clientNtype.type;

    let template_id = await _saveTemplate(saving_request);

    await db.order.update({ status: 2 }, { where: { id: req.body.order_id } });

    await db.templates_category.create({
      template_id: template_id.id,
      category_id: req.body.category_id,
    });

    return res.send({ code: "SUCCESS", message: "The order has been completed" });
  } catch (e) {
    return res.send({ code: "ERROR", message: "Error when trying to complete the order" });
  }
}

module.exports = {
  createOrder,
  getOrders,
  applyOrderToOperator,
  changeOrderStatus,
  completeOrder,
};
