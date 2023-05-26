import { readFileSync, writeFileSync } from "fs";
import Path from "path";
import schemas from "../src/router/schemas.js";

export function addToApiDoc(res, test) {
  const filePath = Path.join(__dirname, "../swagger/swagger-output.json");
  const schemaFilePath = Path.join(__dirname, "../router/scheas.js");
  let doc = readFileSync(filePath);
  doc = JSON.parse(doc);

  const method = res.req.method.toLowerCase();

  if (!doc.paths[res.req.path][method].responses[res.statusCode])
    doc.paths[res.req.path][method].responses[res.statusCode] = {};

  const tag = res.req.path.split(Path.sep)[1];
  if (!doc.paths[res.req.path][method].tags)
    doc.paths[res.req.path][method].tags = [tag];

  if (!doc.paths[res.req.path][method].responses[res.statusCode].content)
    doc.paths[res.req.path][method].responses[res.statusCode].content = {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            type: "object"
          }
        },
        examples: {}
      }
    };

  doc.paths[res.req.path][method].responses[res.statusCode].content[
    "application/json"
  ].examples[test.title] = {
    value: res.body
  };

  doc.paths[res.req.path][method].requestBody.content[
    "application/json"
  ].schema = getSchemaByPath(res.req.path);

  function getSchemaByPath(path) {
    const pathArr = path.split("/");
    let schema = schemas;
    pathArr.forEach((el) => {
      if (el) schema = schema[el];
    });
    return schema;
  }

  writeFileSync(filePath, JSON.stringify(doc));
}
