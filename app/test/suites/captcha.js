import chai from "chai";
import server from "../../src/index.js";
import chaiHttp from "chai-http";
import { addToApiDoc } from "../util.js";
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

describe("Captcha flow", () => {
  const path = "/client/auth/signin";
  const data = { email: "some1@email.com", password: "password" };
  const captcha = genRandomString();

  it("captcha not validated", async function () {
    const res = await request({
      path,
      data: {
        ...data,
        captcha: "wrong_token"
      }
    });
    res.body.should.have.property("code").equal("CAPTCHA_FAILED");
    addToApiDoc(res, this.test);
  });

  it("successful captcha", async function () {
    const res = await request({
      path,
      data: {
        ...data,
        captcha
      }
    });
    res.body.should.have.property("code").equal("AUTHFAILED");
  });

  it("fail on same captcha", async function () {
    const res = await request({
      path,
      data: {
        ...data,
        captcha
      }
    });
    res.body.should.have.property("code").equal("CAPTCHA_FAILED");
  });
});
