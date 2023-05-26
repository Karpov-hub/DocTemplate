const db = require("@app/db");
import chai from "chai";
import server from "../../src/index.js";
import chaiHttp from "chai-http";
//import redis from "@app/redis";
const should = chai.should();
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
//const storedKey = `restore-password:${"some@email.com"}`;
//const token = await redis.get(storedKey);
let token;

describe("Admin auth", () => {
  const path = "/auth/signin";

  it("should return auth token on valid credentials", async function () {
    const res = await request({
      path,
      data: { login: "yalex", password: "Passw0rd" }
    });
    token = res.body.token
    res.body.should.have.property("token");
    addToApiDoc(res, this.test);
  });

  it("signin should fail with missing parameters", async function () {
    const res = await request({ path });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("signin should fail with wrong username", async function () {
    const res = await request({
      path,
      data: { login: "yalex1", password: "Passw0rd" }
    });
    res.body.should.have.property("code").equal("AUTHENTICATIONFAILED");
    addToApiDoc(res, this.test);
  });

  it("signin should fail with wrong password", async function () {
    const res = await request({
      path,
      data: { login: "yalex", password: "Passw0rd1" }
    });
    res.body.should.have.property("code").equal("AUTHENTICATIONFAILED");
    addToApiDoc(res, this.test);
  });
});

describe("Refreshing the token", () => {
  const path = "/auth/refreshToken";

  it("should return success: true if there is a token", async function () {
    const res = await request({
      path,
      data: { token }
    });
    res.body.should.have.property("success").equal(true);
    addToApiDoc(res, this.test);
  });

  it("should fail if there is no token", async function () {
    const res = await request({
      path,
      data: {}
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("should fail if sending an invalid token", async function () {
    const res = await request({
      path,
      data: { token: "dhjm" }
    });
    res.body.should.have.property("success").equal(false);
    addToApiDoc(res, this.test);
  });
});

describe("Getting user data", () => {
  const path = "/auth/getUserData";

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
    // res.body.should.have.property("code").equal("USERNOTFOUND");
    // addToApiDoc(res, this.test);
  });

  it("should return the code: USERNOTFOUND, on the wrong token", async function () {
    const res = await request({
      path,
      data: { token: "fdgjgd" }
    });
    res.body.should.have.property("code").equal("USERNOTFOUND");
    addToApiDoc(res, this.test);
  });

  it("should return user_data, to the admin", async function () {
    const res = await request({
      path,
      data: { token }
    });
    res.body.should.have.property("user_data");
    addToApiDoc(res, this.test);
  });

  it("should return code: ROLENOTFOUND if the user has no role", async function () {
    const user = await request({
      path: "/auth/signin",
      data: { login: "user", password: "Passw0rd" }
    });
    let tokenUser = user.body.token;
    const res = await request({
      path,
      data: { token: tokenUser }
    });
    res.body.should.have.property("code").equal("ROLENOTFOUND");
    addToApiDoc(res, this.test);
  });

  it("should return code: ROLENOTFOUND if the user role does not have modules", async function () {
    const user2 = await request({
      path: "/auth/signin",
      data: { login: "user2", password: "Passw0rd" }
    });
    let tokenUser = user2.body.token;
    const res = await request({
      path,
      data: { token: tokenUser }
    });
    res.body.should.have.property("code").equal("ROLENOTFOUND");
    addToApiDoc(res, this.test);
  });
  //Убедитесь что у role2 есть данные в поле modules в базе данных
  it("should return user_data", async function () {
    const user3 = await request({
      path: "/auth/signin",
      data: { login: "user3", password: "Passw0rd" }
    });
    let tokenUser = user3.body.token;

    const res = await request({
      path,
      data: { token: tokenUser }
    });
    res.body.should.have.property("user_data");
    res.body.should.have.property("permissions");
    addToApiDoc(res, this.test);
  });

  it("removing the seeds of roles and users", async function () {
    db.user.destroy({
      where: { id: "778208aa-8266-4c28-9cde-143f697b495d", },
    });
    db.user.destroy({
      where: { id: "a167a6fc-4be4-4e0e-83c5-0235ce33eed1", },
    });
    db.user.destroy({
      where: { id: "bc4e751c-b968-42db-85cf-41b75205c9d5", },
    });
    db.role.destroy({
      where: { id: "6ff8c9f9-d2e0-4b8e-b324-e1057c5b2e88", },
    });
    db.role.destroy({
      where: { id: "a353c1c0-4378-41ad-b4e5-17def5852d06", },
    });
    // res.body.should.have.property("code").equal("USERNOTFOUND");
    // addToApiDoc(res, this.test);
  });
});

describe("Admin logout", () => {
  const path = "/auth/logout";

  it("should return success: true if there is a token", async function () {
    const res = await request({
      path,
      data: { token }
    });
    res.body.should.have.property("success").equal(true);
    addToApiDoc(res, this.test);
  });

  it("should return success: true if there is no token", async function () {
    const res = await request({
      path,
      data: {}
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("should return success: false if sending an invalid token", async function () {
    const res = await request({
      path,
      data: { token: "dhjm" }
    });
    res.body.should.have.property("success").equal(false);
    addToApiDoc(res, this.test);
  });
});
