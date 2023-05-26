const db = require("@app/db");
const uuid = require("uuid").v4;
const nodemailer = require("nodemailer");
const config = require("@app/config");

async function getInnerDocuments(req, res) {
  let where = {};
  if (req.body.filter)
    where = { [req.body.filter.property]: [req.body.filter.value] };
  let innerDocuments = await db.inner_document.findAndCountAll({
    where,
    attributes: req.body.fields,
    offset: req.body.start,
    limit: req.body.limit,
    order: req.body.order ? [req.body.order.field, req.body.order.dir] : null,
    include: {
      model: db.jasper_report_template,
      attributes: [
        "id",
        "report_name_for_user",
        "report_name_in_system",
        "code",
        "images"
      ]
    }
  });
  return res.send(innerDocuments);
}

async function updateInnerDocuments(req, res) {
  try {
    if (req.body.file && req.body.file.length > 0) {
      req.body.code = req.body.file[0].code;
    } else {
      req.body.code = req.body.code;
    }

    req.body.images = [];
    if (req.body.files) {
      for (let file of req.body.files) {
        req.body.images.push({ name: file[0].name, code: file[0].code });
      }
    }
    if (req.body.images_codes) {
      req.body.images_codes = JSON.parse(req.body.images_codes);
      for (let image of req.body.images_codes) {
        if (
          !req.body.images.find((el) => {
            return el.code == image.code;
          })
        )
          req.body.images.push(image);
      }
    }
    delete req.body.file;
    delete req.body.files;
    if (!req.body.id) req.body.id = uuid();
    if (!req.body.template) req.body.template = uuid();
    let jrt_data = {
      id: req.body.template,
      report_name_for_user: req.body.name,
      report_name_in_system: req.body.system_name,
      ctime: req.body.ctime,
      images: req.body.images
    };
    if (req.body.code) jrt_data.code = req.body.code;
    let inner_docs_data = {
      id: req.body.id,
      template: req.body.template,
      type: req.body.type,
      ctime: req.body.ctime,
      data_example: req.body.data_example
    };
    if (
      await db.jasper_report_template.upsert(jrt_data).catch((e) => {
        console.log(
          "Jasper report. Document controller. updateInnerDocument func error: ",
          e
        );
        throw "TEMPLATENOTLOADED"
      })
    ) {
      await db.inner_document.upsert(inner_docs_data).catch((e) => {
        console.log(
          "Jasper report. Document controller. updateInnerDocument func error: ",
          e
        );
        throw "TEMPLATENOTLOADED"
      });
      return res.send({ success: true });
    }
    throw "TEMPLATENOTLOADED"
  } catch (e) {
    console.log(
      "Jasper report. Document controller. updateInnerDocument func error: ",
      e
    );
    return res.send({ code: "TEMPLATENOTLOADED" });
  }
}

async function sendMessage(req, res) {
  let employee_data = await db.employee.findOne({
    where: { id: req.body.employee_id }
  });
  let transporter = nodemailer.createTransport(config.transporter);
  await transporter
    .sendMail({
      from: config.mail_from,
      to: employee_data.get("email"),
      subject: `Document: ${req.body.file_name}`,
      attachments: [
        {
          filename: `${req.body.file_name}.${req.body.extension.toLowerCase()}`,
          path: req.body.file
        }
      ]
    })
    .catch((e) => {
      console.log(e);
      return res.send({ code: "MESSAGENOTSENT" });
    });
  return res.send({ success: true });
}

module.exports = {
  getInnerDocuments,
  updateInnerDocuments,
  sendMessage
};
