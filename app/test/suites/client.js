import chai from "chai";
import server from "../../src/index.js";
import chaiHttp from "chai-http";
import { addToApiDoc } from "../util.js";
import redis from "@app/redis";
import db from "@app/db";
import crypto from "crypto";

const should = chai.should();
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

let regToken;

const client = {
  email: "personal@email.com",
  password: "Passw0rd1",
  first_name: "Bruce",
  last_name: "Willis",
  middle_name: null,
  phone: "01902 754761"
};

const clientBusiness = {
  email: "business@email.com",
  company_name: "My Company",
  password: "Passw0rd2",
  company_director_fullname: "Jonhn Doe",
  phone: "01902 754762"
};

let clientDb;

describe("Client signup Personal flow", () => {
  const path = "/client/auth/signup_personal";

  it("successful registration", async function () {
    const res = await request({
      path,
      data: { ...client, captcha: genRandomString() }
    });
    res.body.should.have.property("code").equal("SUCCESS");

    const clientRecord = await db.client.findOne({
      where: { email: client.email }
    });
    clientRecord.first_name.should.equal(client.first_name);
    clientRecord.last_name.should.equal(client.last_name);
    clientRecord.phone.should.equal(client.phone);
    clientRecord.type.should.equal("personal");
    clientRecord.activated.should.equal(false);

    addToApiDoc(res, this.test);
  });

  it("signup should fail with missing parameters", async function () {
    const res = await request({ path: "/client/auth/signup_personal" });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("signip should fail with registered email", async function () {
    const res = await request({
      path: "/client/auth/signup_personal",
      data: { ...client, captcha: genRandomString() }
    });
    res.body.should.have.property("code").equal("EMAILALREADYREGISTERED");
    res.body.should.have
      .property("message")
      .equal("Sorry, you can't sign up with this email id");
    addToApiDoc(res, this.test);
  });
});

describe("Client signup Business flow", () => {
  const path = "/client/auth/signup_business";

  it("successful registration", async function () {
    const res = await request({
      path,
      data: { ...clientBusiness, captcha: genRandomString() }
    });
    res.body.should.have.property("code").equal("SUCCESS");

    const clientRecord = await db.client.findOne({
      where: { email: clientBusiness.email }
    });
    clientRecord.company_name.should.equal(clientBusiness.company_name);
    clientRecord.company_director_fullname.should.equal(
      clientBusiness.company_director_fullname
    );
    clientRecord.phone.should.equal(clientBusiness.phone);
    clientRecord.type.should.equal("business");
    clientRecord.activated.should.equal(false);

    addToApiDoc(res, this.test);
  });

  it("signup should fail with missing parameters", async function () {
    const res = await request({ path: "/client/auth/signup_business" });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("signip should fail with registered email", async function () {
    const res = await request({
      path: "/client/auth/signup_business",
      data: { ...clientBusiness, captcha: genRandomString() }
    });
    res.body.should.have.property("code").equal("EMAILALREADYREGISTERED");
    res.body.should.have
      .property("message")
      .equal("Sorry, you can't sign up with this email id");
    addToApiDoc(res, this.test);
  });
});

describe("Client profile activation flow", () => {
  it("fail if profile is not activated", async function () {
    const res = await request({
      path: "/client/auth/signin",
      data: {
        ...client,
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("code").equal("CLIENTNOTACTIVATED");
    addToApiDoc(res, this.test);
  });

  it("fail on missing parameters", async function () {
    const res = await request({ path: "/client/auth/activate-profile" });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("fail on incorrect token", async function () {
    const res = await request({
      path: "/client/auth/activate-profile",
      data: {
        activation_token: "smth",
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("code").equal("ACTIVATIONERROR");
    res.body.should.have.property("message").equal("Profile activation error");
    addToApiDoc(res, this.test);
  });

  it("password reset request fail if the profile is not activated", async function () {
    const res = await request({
      path: "/client/auth/password-restore",
      data: { email: client.email, captcha: genRandomString() }
    });
    res.body.should.have.property("code").equal("CLIENTNOTACTIVATED");
    addToApiDoc(res, this.test);
  });

  it("successful activation", async function () {
    clientDb = await db.client.findOne({ where: { email: client.email } });
    const keys = await redis.keys(`activate:*:${client.email}`);
    regToken = keys[0].split(":")[1];
    const res = await request({
      path: "/client/auth/activate-profile",
      data: {
        activation_token: regToken,
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have
      .property("message")
      .equal("Profile successfully activated");
    addToApiDoc(res, this.test);
  });

  it("fail on already activated", async function () {
    const res = await request({
      path: "/client/auth/activate-profile",
      data: {
        activation_token: regToken,
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("code").equal("ACTIVATIONERROR");
    res.body.should.have.property("message").equal("Profile activation error");
  });
});

describe("Client signin", () => {
  let otpToken;
  let otp;
  let token;

  it("fail on missing parameters", async function () {
    const res = await request({ path: "/client/auth/signin" });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("fail on wrong username", async function () {
    const res = await request({
      path: "/client/auth/signin",
      data: {
        email: "some1@email.com",
        password: client.password,
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("code").equal("AUTHFAILED");
    res.body.should.have.property("message").equal("Failed to authorize");
    addToApiDoc(res, this.test);
  });

  it("fail with wrong password", async function () {
    const res = await request({
      path: "/client/auth/signin",
      data: {
        email: client.email,
        password: "Passw0rd13453",
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("code").equal("AUTHFAILED");
    res.body.should.have.property("message").equal("Failed to authorize");
    addToApiDoc(res, this.test);
  });

  it("success - should return auth token", async function () {
    const res = await request({
      path: "/client/auth/signin",
      data: {
        email: client.email,
        password: client.password,
        captcha: genRandomString()
      }
    });
    res.body.code.should.equal("SUCCESS");
    should.exist(res.body.session_token);
    token = res.body.session_token;
    addToApiDoc(res, this.test);
  });

  it.skip("otp signin fail on missing parameters", async function () {
    const res = await request({
      path: "/client/auth/check-otp",
      data: {}
    });
    res.body.should.have.property("status").equal("VALIDATIONSCHEMAERROR");
    res.body.should.not.have.property("code");
    res.body.should.not.have.property("session_token");
  });

  it.skip("otp signin fail on wrong otp token", async function () {
    const stored = await redis.get(`otp${otpToken}`);
    otp = JSON.parse(stored).otp;
    const res = await request({
      path: "/client/auth/check-otp",
      data: { otp, otp_token: "otpToken" }
    });
    res.body.should.have.property("code").equal("OTPFAILED");
    res.body.should.not.have.property("session_token");
    addToApiDoc(res, this.test);
  });

  it.skip("otp signin fail on wrong otp", async function () {
    const res = await request({
      path: "/client/auth/check-otp",
      data: { otp: "000000", otp_token: otpToken }
    });
    res.body.should.have.property("code").equal("OTPFAILED");
    res.body.should.not.have.property("session_token");
    addToApiDoc(res, this.test);
  });

  it.skip("otp signin success", async function () {
    const res = await request({
      path: "/client/auth/check-otp",
      data: { otp, otp_token: otpToken }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("session_token");
    global.testScope.authToken = res.body.session_token;
    addToApiDoc(res, this.test);
  });

  it.skip("otp signin fail if otp is already submitted", async function () {
    const res = await request({
      path: "/client/auth/check-otp",
      data: { otp, otp_token: otpToken }
    });
    res.body.should.have.property("code").equal("OTPFAILED");
    res.body.should.not.have.property("session_token");
    addToApiDoc(res, this.test);
  });
});

describe("Client password restore", () => {
  let token;
  it("password restore request fail if no such user", async function () {
    const res = await request({
      path: "/client/auth/password-restore",
      data: { email: "unexistent@email.com", captcha: genRandomString() }
    });
    res.body.should.have.property("code").equal("ERROR");
    addToApiDoc(res, this.test);
  });

  it("password restore request fail on missing parameters", async function () {
    const res = await request({
      path: "/client/auth/password-restore",
      data: { captcha: genRandomString() }
    });
    res.body.should.have.property("status").equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("successful password restore request", async function () {
    const res = await request({
      path: "/client/auth/password-restore",
      data: { email: client.email, captcha: genRandomString() }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    addToApiDoc(res, this.test);
  });

  it("password restore submit fail on missing parameters", async function () {
    const res = await request({
      path: "/client/auth/password-restore-submit",
      data: { email: client.email, captcha: genRandomString() }
    });
    res.body.should.have.property("status").equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("password restore submit fail on unexistent client", async function () {
    const res = await request({
      path: "/client/auth/password-restore-submit",
      data: {
        email: "unexistent@email.com",
        password: "newP@ssw0rd",
        token: genRandomString(),
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("code").equal("ERROR");
    addToApiDoc(res, this.test);
  });

  it("password restore submit fail on wrong token", async function () {
    const res = await request({
      path: "/client/auth/password-restore-submit",
      data: {
        email: client.email,
        password: "newP@ssw0rd",
        token: genRandomString(),
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("code").equal("WRONGTOKEN");
    addToApiDoc(res, this.test);
  });

  it("password restore submit success", async function () {
    const password = "newP@ssw0rd";
    const storedKey = `restore-password:${client.email}`;
    token = await redis.get(storedKey);
    const res = await request({
      path: "/client/auth/password-restore-submit",
      data: {
        email: client.email,
        password,
        token,
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    client.password = password;
    addToApiDoc(res, this.test);
  });

  it("should not be able to restore password with the same link twice", async function () {
    const password = "newP@ssw0rd";
    const res = await request({
      path: "/client/auth/password-restore-submit",
      data: {
        email: client.email,
        password,
        token,
        captcha: genRandomString()
      }
    });
    res.body.should.have.property("code").equal("WRONGTOKEN");
    addToApiDoc(res, this.test);
  });

  it("user should be able to login with new password", async function () {
    const res = await request({
      path: "/client/auth/signin",
      data: {
        email: client.email,
        password: client.password,
        captcha: genRandomString()
      }
    });
    res.body.code.should.equal("SUCCESS");
    should.exist(res.body.session_token);
    token = res.body.session_token;
  });
});
