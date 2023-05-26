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

describe("Get Permissions", () => {
  const path = "/user/getPermissions";
  it("creating seeds of roles and users", async function () {
    const roles = [
      {
        id: "6ff8c9f9-d2e0-4b8e-b324-e1057c5b2e88",
        name: "role",
      }, {
        id: "a353c1c0-4378-41ad-b4e5-17def5852d06",
        name: "role2",
        modules: [{ title: 'Report manager', xtype: 'reportManager' }],
      }
    ]
    roles.forEach(element => {
      db.role.create(element);
    });
    const users = [{
      id: "778208aa-8266-4c28-9cde-143f697b495d",
      login: "user",
      password: "qzjq2ut0ZZnywe6Q+CZ/MfRnNHRidkok1xrBhD7nf+M=",
      su: false
    }, {
      id: "a167a6fc-4be4-4e0e-83c5-0235ce33eed1",
      login: "user2",
      password: "qzjq2ut0ZZnywe6Q+CZ/MfRnNHRidkok1xrBhD7nf+M=",
      role: "6ff8c9f9-d2e0-4b8e-b324-e1057c5b2e88",
      su: false
    }, {
      id: "bc4e751c-b968-42db-85cf-41b75205c9d5",
      login: "user3",
      password: "qzjq2ut0ZZnywe6Q+CZ/MfRnNHRidkok1xrBhD7nf+M=",
      role: "a353c1c0-4378-41ad-b4e5-17def5852d06",
      su: false
    }]
    users.forEach(element => {
      db.user.create(element);
    });
  });
  it("should return rows and count", async function () {
    const res = await request({
      path,
      data: {}
    });
    res.body.should.have.property("count");
    res.body.should.have.property("rows");
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: {
        start: [],
        limit: [],
        filter: [],
        order: [],
      }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Update Permissions", () => {
  const path = "/user/updatePermissions";
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: {
        name: "test",
        ctime: "2022-12-27 15:36:40.000 +0300",
      }
    });
    res.body.should.have.property("success").equal(true);
    addToApiDoc(res, this.test);
  });
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: {
        id: "6ff8c9f9-d2e0-4b8e-b324-e1057c5b2e88",
        name: "test",
        ctime: "2022-12-27 15:36:40.000 +0300",
      }
    });
    res.body.should.have.property("success").equal(true);
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: {
        name: [],
      }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Remove Permissions", () => {
  const path = "/user/removePermission";
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: {
        id: "6ff8c9f9-d2e0-4b8e-b324-e1057c5b2e88",
      }
    });
    res.body.should.have.property("success").equal(true);
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: {
        name: [],
      }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});


describe("Get Users", () => {
  const path = "/user/getUsers";
  it("should return rows and count", async function () {
    const res = await request({
      path,
      data: {
      }
    });
    res.body.should.have.property("count");
    res.body.should.have.property("rows");
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: {
        filter: [],
      }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Update Users", () => {
  const path = "/user/updateUsers";
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: {
        role: "a353c1c0-4378-41ad-b4e5-17def5852d06",
        name: "test",
        login: "test",
        password: "password",
        ctime: "2022-12-27 15:36:40.000 +0300",
      }
    });
    res.body.should.have.property("success").equal(true);
    addToApiDoc(res, this.test);
  });
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: {
        id: "778208aa-8266-4c28-9cde-143f697b495d",
        role: "a353c1c0-4378-41ad-b4e5-17def5852d06",
        name: "user",
        login: "user",
        password: "password",
        ctime: "2022-12-27 15:36:40.000 +0300",
      }
    });
    res.body.should.have.property("success").equal(true);
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: {
        login: [],
      }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Block User", () => {
  const path = "/user/blockUser";
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: {
        id: "778208aa-8266-4c28-9cde-143f697b495d",
        action: "block",
      }
    });
    res.body.should.have.property("success").equal(true);
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: {
        action: [],
      }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Remove User", () => {
  const path = "/user/removeUser";
  it("should return SUCCESS: true", async function () {
    const res = await request({
      path,
      data: {
        id: "778208aa-8266-4c28-9cde-143f697b495d",
      }
    });
    res.body.should.have.property("success").equal(true);
    addToApiDoc(res, this.test);
  });
  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: {
        id: [],
      }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
  it("removing the seeds of roles and users", async function () {
    db.user.destroy({
      where: { id: "a167a6fc-4be4-4e0e-83c5-0235ce33eed1", },
    });
    db.user.destroy({
      where: { id: "bc4e751c-b968-42db-85cf-41b75205c9d5", },
    });
    db.user.destroy({
      where: { name: "test", },
    });
    db.role.destroy({
      where: { id: "a353c1c0-4378-41ad-b4e5-17def5852d06", },
    });
    db.role.destroy({
      where: { name: "test", },
    });
  });
});