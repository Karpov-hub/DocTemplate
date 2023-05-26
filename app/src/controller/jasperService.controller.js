const db = require("@app/db");
const fs = require("fs");
const FileProvider = require("@app/fileprovider");
const { Readable } = require("stream");
let jasper = require("@app/node-jasper")({
  path: "./jasperreports-6.18.1",
  // reports
});
const { v4: uuidv4 } = require("uuid");
const Op = db.Sequelize.Op;

async function writeImages(fileStream, filename) {
  return new Promise((resolve, reject) => {
    try {
      let stream = fs.createWriteStream(`${process.cwd()}/../tmp/${filename}`, {
        flags: "w+",
      });
      fileStream.pipe(stream);
      stream.on("close", () => {
        resolve({ filename });
      });
    } catch (err) {
      console.log(`Jasper-service, writeImages func. Error ${err}`);
      reject(err);
    }
  });
}

async function writeTemplate(fileStream, filename, reportName) {
  return new Promise((resolve, reject) => {
    try {
      let stream = fs.createWriteStream(`${process.cwd()}/../tmp/${filename}`, {
        flags: "w+",
      });
      fileStream.pipe(stream);
      stream.on("close", () => {
        resolve({
          [reportName]: {
            [filename.substr(
              filename.indexOf(".") + 1
            )]: `${process.cwd()}/../tmp/${filename}`,
            conn: "in_memory_json",
          },
        });
      });
    } catch (err) {
      console.log(`Jasper-service, writeTemplate func. Error ${err}`);
      reject(err);
    }
  });
}
async function connectToJasper(data) {
  let template = await db.jasper_report_template.findOne({
    where: { report_name_in_system: data.report_name },
    raw: true,
  });
  if (!template) return { err: "REPORTTEMPLATENOTFOUND" };
  let file = await FileProvider.default.getContent(template);
  if (file.data.content)
    file.data.stream = Readable.from(
      Buffer.from(file.data.content, "base64").toString()
    );
  let reports = await writeTemplate(
    file.data.stream,
    file.meta.filename,
    data.report_name
  );
  let images_names = [];
  if (template.images)
    for (let img of template.images) {
      let image = await FileProvider.default.getContent(img);
      if (image.data.content)
        image.data.stream = Readable.from(
          Buffer.from(image.data.content, "base64").toString()
        );
      images_names.push(image.meta.filename);
      await writeImages(image.data.stream, image.meta.filename);
    }
  return { reports, filename: file.meta.filename, images_names };
}

async function removeFileFromServer(filename) {
  return new Promise((resolve, reject) => {
    fs.unlink(`${process.cwd()}/../tmp/${filename}`, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

async function getJasperReport(data, jasper, attemption = 1) {
  try {
    let reportData = {};
    for (let key of Object.keys(data.report_data)) {
      if (Array.isArray(data.report_data[key]))
        reportData[key] = await jasper.toJsonDataSource(
          { [key]: data.report_data[key] },
          `${key}`
        );
    }
    reportData.images_directory = `${process.cwd()}/../tmp/`;
    let report = await jasper.export(
      {
        report: data.report_name,
        data: reportData,
        dataset: data.report_data,
      },
      data.report_format || "pdf"
    );
    return report;
  } catch (err) {
    console.log(err);
    if (attemption == 3) {
      console.log(`Jasper-service, getJasperReport func. Error ${err.message}`);
      throw { code: "GENERATIONREPORTERROR", message: err.message };
    }
    attemption++;
    return await getJasperReport(data, jasper, attemption);
  }
}

async function generateReport(req) {
  let data = req.body;
  let conn = await connectToJasper(data).catch((e) => {
    console.log(e);
    throw { code: typeof e == "string" ? e : "ERROR", message: e };
  });
  if (conn.err) throw conn.err;
  if (!conn.reports) return { code: "REPORTNOTFOUND" };
  jasper.reports = conn.reports;
  try {
    let report = await getJasperReport(data, jasper);
    await removeFileFromServer(conn.filename);
    if (conn.images_names)
      for (let name of conn.images_names) await removeFileFromServer(name);
    return report;
  } catch (err) {
    console.log(`Jasper-service, generateReport func. Error ${err}`);
    throw { code: "GENERATIONREPORTERROR", message: err };
  }
}

async function getReportInBuffer(req, res) {
  try {
    let report = await generateReport(req);
    console.log(report);
    return res.send({
      file: Buffer.from(report, "base64"),
      file_extension: req.body.report_format || "pdf",
    });
  } catch (err) {
    console.log(`Jasper-service, getReport func. Error ${err}`);
    return res.send({ code: "GENERATIONREPORTERROR", message: err });
  }
}

async function getReportInBase64(req, res) {
  try {
    let report = await generateReport(req);
    return res.send({
      file: report.toString("base64"),
      file_extension: req.body.report_format || "pdf",
    });
  } catch (err) {
    console.log(`Jasper-service, getReport func. Error ${err}`);
    return res.send({ code: "GENERATIONREPORTERROR", message: err });
  }
}

async function getReport(req, res) {
  let data = req.body;
  try {
    let report = await generateReport(req);
    res.set(
      "Content-Disposition",
      `attachment; filename=${encodeURI(data.report_name)}.${data.report_format || "pdf"
      }`
    );
    return res.end(Buffer.from(report));
  } catch (err) {
    console.log(`Jasper-service, getReport func. Error ${err}`);
    return res.send({ code: "GENERATIONREPORTERROR", message: err });
  }
}

async function _saveTemplate(req) {
  req.body.code = req.body.file ? req.body.file[0].code : req.body.code;
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
  req.body.mtime = new Date();
  if (!req.body.id) req.body.id = uuidv4();
  await db.jasper_report_template.upsert(req.body);
  return { id: req.body.id };
}

async function saveTemplate(req, res) {
  await _saveTemplate(req);
  return res.send({ message: "OK" });
}

async function getReportTemplates(req, res) {
  let where = {};
  if (req.body.filter) {
    let filters = JSON.parse(req.body.filter);
    for (let i = 0; i < filters.length; i++) {
      console.log(filters[i].property);
      where[filters[i].property] = {
        [Op[filters[i].operator]]:
          filters[i].property == "ctime"
            ? new Date(filters[i].value)
            : Array.isArray(filters[i].value)
              ? filters[i].value
              : `%${filters[i].value}%`,
      };
    }
  }
  let searching_options = {
    where,
    attributes: req.body.fields,
    offset: req.body.start,
    limit: req.body.limit,
  };
  if (req.body.sort) {
    let sorting = JSON.parse(req.body.sort);
    searching_options.order = [[sorting[0].property, sorting[0].direction]];
  }
  let result = await db.jasper_report_template.findAndCountAll(
    searching_options
  );
  return res.send(result);
}

async function removeTemplate(req, res) {
  await db.jasper_report_template.destroy({
    where: {
      id: req.body.id,
    },
  });
  return res.send({ message: "OK" });
}

async function checkUniqueSystemReportName(req, res) {
  let where = { report_name_in_system: req.body.name };
  if (req.body.id) where.id = { [Op.ne]: req.body.id };
  let { id = null } =
    (await db.jasper_report_template.findOne({
      where,
      attributes: ["id"],
      raw: true,
    })) || {};
  if (!id) return res.send({ unique: true });
  return res.send({ unique: false });
}

module.exports = {
  getReport,
  saveTemplate,
  getReportTemplates,
  removeTemplate,
  getReportInBase64,
  getReportInBuffer,
  checkUniqueSystemReportName,
  _saveTemplate
};
