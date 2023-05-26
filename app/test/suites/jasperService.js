const db = require("@app/db");
import chai from "chai";
import server from "../../src/index.js";
import chaiHttp from "chai-http";
import { addToApiDoc } from "../util.js";

chai.use(chaiHttp);

const request = ({ path = "/", data = {}, type = "post" }) =>
  new Promise((resolve, reject) => {
    chai
      .request(server)
    [type](path)
      .send(data)
      .end((err, res) => {
        if (err) reject(err);
        resolve(res);
      });
  });

// describe("Save Template", () => {
//   const path = "/jasperService/saveTemplate";
//   it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
//     const res = await request({
//       path,
//       data: {}
//     });
//     res.body.status.should.equal("VALIDATIONSCHEMAERROR");
//     addToApiDoc(res, this.test);
//   });

//   it("should return the code: CATEGORYEXIST if the category already exists", async function () {
//     const res = await request({
//       path,
//       data: { name: {}, description: {} }
//     });
//     res.body.should.have.property("code").equal("CATEGORYEXIST");
//     addToApiDoc(res, this.test);
//   });

//   it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
//     const res = await request({
//       path,
//       data: { name: "", description: "" }
//     });
//     res.body.status.should.equal("VALIDATIONSCHEMAERROR");
//     addToApiDoc(res, this.test);
//   });
// });

describe("Get Report", () => {
  const path = "/jasperService/getReport";
  it("should return VALIDATIONSCHEMAERROR if no data is sent", async function () {
    const res = await request({
      path,
      data: {}
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");

    addToApiDoc(res, this.test);
  });

  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: { report_name: {}, report_data: {} }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("should return GENERATIONREPORTERROR if passing empty properties", async function () {
    const res = await request({
      path,
      data: { report_name: "", report_data: {} }
    });
    res.body.should.have.property("code").equal("GENERATIONREPORTERROR");
    res.body.should.have.property("message").equal("REPORTTEMPLATENOTFOUND");
    addToApiDoc(res, this.test);
  });

  it("should return GENERATIONREPORTERROR if passing empty properties", async function () {
    const res = await request({
      path,
      data: { report_name: "report_name", report_data: {} }
    });
    // console.log("res.body :", res.body);
    res.body.should.have.property("code").equal("GENERATIONREPORTERROR");
    res.body.should.have.property("message").equal("REPORTTEMPLATENOTFOUND");
    addToApiDoc(res, this.test);
  });
});