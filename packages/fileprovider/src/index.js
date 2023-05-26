import config from "@app/config";
import db from "@app/db";
import Connectors from "./connectors";
const uuidv1 = require("uuid/v1");

const Connector = Connectors[config.fileProviderType || "local"];

async function push(file, holdTimeout = 0) {
  var uuid = uuidv1();
  let addHoldTime = new Date();

  let pushFile = {};

  if (!Buffer.isBuffer(file.data)) {
    let decodedFile = await splitBase64(file.data);

    file.originalData = Buffer.from(decodedFile.data, "base64");
    file.size = Buffer.byteLength(file.originalData);
    file.mime_type = decodedFile.type;
    pushFile = {
      code: uuid,
      data: file.originalData,
    };
  } else
    pushFile = {
      code: uuid,
      data: file.data,
    };

  let isPushed = await Connector.push(pushFile);

  if (isPushed)
    await db.provider.create({
      code: uuid,
      filename: file.name,
      file_size: file.size,
      mime_type: file.mime_type,
      upload_date: new Date(),
      storage_date: addHoldTime.setSeconds(
        addHoldTime.getSeconds() + holdTimeout
      ),
    });
  return {
    success: true,
    code: uuid,
    size: file.size,
  };
}

async function pull(code) {
  let fileCode = code.code;
  let res = await db.provider.findOne({
    where: {
      code: fileCode,
    },
  });
  let pulledFile = {
    name: res.filename,
    size: res.file_size,
    mime_type: res.mime_type,
    data: config.fileGateUrl + "/download/" + fileCode, //`data:${res.dataValues.mime_type};base64,${base64Data}`
  };
  return pulledFile;
}

async function getContent(file) {
  let fileCode = file.code;
  let res = await db.provider.findOne({
    where: {
      code: fileCode,
    },
  });
  if (!res) throw "FILENOTFOUND";
  let pulledFileData = await Connector.pull(fileCode);

  return {
    meta: res.toJSON(),
    data: pulledFileData,
  };
}

async function status(code) {
  let fileCode = code.code;
  if (!(await Connector.exists(fileCode))) throw "FILENOTFOUND";

  let res = await db.provider.findOne({
    where: {
      code: fileCode,
    },
  });

  return {
    name: res.dataValues.filename,
    size: res.dataValues.file_size,
  };
}

async function del(code) {
  let fileCode = code.code;

  let isDelete = await Connector.del(fileCode);

  await db.provider.update(
    {
      removed: 1,
    },
    {
      where: {
        code: fileCode,
      },
    }
  );

  if (isDelete)
    return {
      success: true,
      code: fileCode,
    };
  return {
    success: false,
  };
}

async function accept(files) {
  for (let item of files) {
    await db.provider.update(
      {
        storage_date: null,
      },
      {
        where: {
          code: item.code,
        },
      }
    );
  }
  return {
    success: true,
  };
}

async function watermarkFile(code) {
  return await Connector.watermarkFile(code.code);
}

function splitBase64(dataString) {
  let response = {};
  let beginTypeIndex = dataString.indexOf(":") + 1;
  let endTypeIndex = dataString.indexOf(";");
  let indexBase64 = dataString.indexOf(",") + 1;

  response.type = dataString.slice(beginTypeIndex, endTypeIndex);
  response.data = dataString.substr(indexBase64);

  return response;
}

export default {
  push,
  pull,
  status,
  del,
  accept,
  watermarkFile,
  getContent,
};
