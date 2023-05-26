const db = require("@app/db");
import chai from "chai";
import server from "../../src/index.js";
import chaiHttp from "chai-http";
import { addToApiDoc } from "../util.js";
import crypto from "crypto";
import { connected } from "process";

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
const genRandomString = () => crypto.randomBytes(20).toString("hex");
let token, order_id, category_id = "5df5220e-5a25-4d68-b00a-ed68bb470421"

describe("Creating a order", () => {
  const path = "/order/create-order";
  const client = {
    email: "personal@email.com",
    password: "newP@ssw0rd",
  };

  it("success - should return auth token", async function () {
    const res = await request({
      path: "/client/auth/signin",
      data: {
        email: client.email,
        password: client.password,
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("session_token");
    token = res.body.session_token;
  });
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: { session_token: token, template_name: "template_name", requirements: "requirements", type: 0 }
    });
    res.body.should.have.property("success").equal(true);
    res.body.should.have.property("message").equal("Order was successfuly created");
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: { session_token: [], template_name: [], requirements: [], type: [] }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Getting a order", () => {
  const path = "/order/get-order";
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: {}
    });
    order_id = res.body.rows[0].id
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("count");
    res.body.should.have.property("rows");
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: { operator_id: [], start: [], limit: [], div: [] }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Apply order to operator", () => {
  const path = "/order/apply-order-to-operator";
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: { session_token: token, order_id }
    });

    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("message").equal("Order was applied to operator");
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: { operator_id: [], start: [], limit: [], div: [] }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Change order status", () => {
  const path = "/order/change-order-status";
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: { status: 2, order_id }
    });

    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("message").equal("Status was changed");
    addToApiDoc(res, this.test);
  });
  it("should return the code: ERROR if status 3 is sent without note", async function () {
    const res = await request({
      path,
      data: { status: 3, order_id }
    });

    res.body.should.have.property("code").equal("ERROR");
    res.body.should.have.property("message").equal("This status requires a note of reason");
    addToApiDoc(res, this.test);
  });
  it("should return SUCCESS: true on status 3 with note", async function () {
    const res = await request({
      path,
      data: { status: 3, order_id, note: "note" }
    });

    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("message").equal("Status was changed");
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: { operator_id: [], start: [], limit: [], div: [] }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Complete order", () => {
  const path = "/order/complete-order";
  it("creating seeds of categories", async function () {
    db.category.create({
      id: category_id,
      name: "name2",
      description: "description",
    });
  });
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: { order_id, category_id, report_name_for_user: "report_name_for_user", report_name_in_system: "report_name_in_system" }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("message").equal("The order has been completed");
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: { operator_id: [], start: [], limit: [], div: [] }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
  it("removing the seeds of categories", async function () {
    let template_id = await db.templates_category.findOne({
      attributes: ["template_id"],
      where: { category_id },
    });

    db.templates_category.destroy({
      where: { category_id },
    });
    db.jasper_report_template.destroy({
      where: { id: template_id.dataValues.template_id },
    });
    db.category.destroy({
      where: { id: category_id },
    });
  });
});