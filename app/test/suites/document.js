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

describe("Get Inner Documents", () => {
  const path = "/document/getInnerDocuments";

  it("must return the count and rows properties, pass the filter property", async function () {
    const res = await request({
      path,
      data: { where: {} }
    });
    res.body.should.have.property("count")
    res.body.should.have.property("rows")
    addToApiDoc(res, this.test);
  });

  it("should return the count and rows properties if no parameters are passed", async function () {
    const res = await request({
      path,
      data: {}
    });
    res.body.should.have.property("count")
    res.body.should.have.property("rows")
    addToApiDoc(res, this.test);
  });

  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: []
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Update Inner Documents", () => {
  const path = "/document/updateInnerDocuments";

  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: {}
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("should return success: true, if the parameters passed are correct", async function () {
    const res = await request({
      path,
      data: { name: "name", system_name: "system_name", type: "type", data_example: "data_example" }
    });

    res.body.should.have.property("success").equal(true);
    addToApiDoc(res, this.test);
  });

  it("removing the seeds of categories", async function () {
    db.jasper_report_template.destroy({
      where: { report_name_for_user: "name" },
    });
  });
});