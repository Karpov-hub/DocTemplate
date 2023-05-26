const db = require("@app/db");
const Op = db.Sequelize.Op;
const crypto = require("crypto");

async function createCategory(req, res) {
  let filterTable = checkingTableName(req.body.filterTable)

  let table = await db[filterTable].findOne({
    where: { name: req.body.name },
  });
  if (table != null) {
    return res.send({
      code: "CATEGORYEXIST",
      message: "Category is already exist",
    });
  }
  await db[filterTable].create({
    name: req.body.name,
    description: req.body.description,
  });
  return res.send({ code: "SUCCESS", message: "Category was created" });
}

async function getCategories(req, res) {
  let filterTable = checkingTableName(req.body.filterTable)

  const searchingOptions = {
    attributes: ["id", "name", "description"],
  };
  let id = req.body.id;
  if (id != null) {
    const table = await db[filterTable].findOne({
      where: { id: req.body.id },
      attributes: searchingOptions.attributes,
    });
    return res.send({ code: "SUCCESS", category: table });
  }
  searchingOptions.offset = req.body.start;
  searchingOptions.limit = req.body.limit;
  let div = "DESC";
  if (req.body.div != null) {
    div = req.body.div;
  }
  if (req.body.field != null) {
    searchingOptions.order = [[req.body.field, div]];
  }
  if (req.body.name != null)
    searchingOptions.where = { name: { [Op.like]: `%${filter.name}%` } };
  const { count, rows } = await db[filterTable].findAndCountAll(searchingOptions);
  return res.send({ code: "SUCCESS", count, rows });
}

async function updateCategory(req, res) {
  let filterTable = checkingTableName(req.body.filterTable)

  let updatingOptions = { ...req.body };
  await db[filterTable].update(updatingOptions, { where: { id: req.body.id } });
  return res.send({
    code: "SUCCESS",
    message: "Category data was updated",
  });
}

async function deleteCategory(req, res) {
  let filterTable = checkingTableName(req.body.filterTable)

  await db.templates_category.destroy(
    { where: { [filterTable + "_id"]: req.body.id } }
  );
  await db[filterTable].destroy({
    where: { id: req.body.id },
  });
  return res.send({ code: "SUCCESS", message: "Category was deleted" });
}

async function bindToCategory(req, res) {
  let filterTable = checkingTableName(req.body.filterTable)

  await db.templates_category.create({
    [filterTable + "_id"]: req.body[filterTable + "_id"],
    template_id: req.body.template_id,
  });

  return res.send({
    code: "SUCCESS",
    message: "Template was binded to category",
  });
}

async function getTemplates(req, res) {
  /*
  Добавить вывод шаблонов по id категории.
  ЕСЛИ стоит private = false, выводить
  шаблоны не зависимо от client_id
  ЕСЛИ стоит private = true, выводить этот 
  шаблон ТОЛЬКО тому клиенту, который был заказчиком шаблона.
  */
  let id;
  if (req.body.client_id) {
    id = req.body.client_id;
  }
  if (req.body.token) {
    id = await redis.get(req.body.token);
  }
  if (!id) {
    let publicTemplates = await db.templates_category.findAndCountAll({
      where: { category_id: req.body.category_id },
      include: [
        {
          model: db.jasper_report_template,
          where: {
            private: { [Op.or]: [false, null] },
          },
        },
      ],
    });
    return res.send({
      code: "SUCCESS",
      publicTemplates: publicTemplates,
    });
  }
  if (id) {
    let privateTemplates = await db.templates_category.findAndCountAll({
      where: { category_id: req.body.category_id },
      include: [
        {
          model: db.jasper_report_template,
          where: {
            private: true,
            client_id: id,
          },
        },
      ],
    });
    return res.send({
      code: "SUCCESS",
      privateTemplates: privateTemplates,
    });
  }
}

function checkingTableName(filterTable) {
  const filterTables = [
    "category",
    "life_situation",
    "group",
  ]
  return filterTables[filterTable]
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  bindToCategory,
  getTemplates,
};
