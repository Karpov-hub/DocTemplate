import fileProvider from "../src";
import chai from "chai";
import * as fs from "fs";
import path from "path";

let should = chai.should();
const expect = chai.expect;

const fsPromises = fs.promises;
let code = null;

describe("Testing file provider", () => {
  it("Push file", async () => {
    const filePath = path.join(__dirname, "image.jpeg");
    const fileData = await fsPromises.readFile(filePath);
    const res = await fileProvider.push({ data: fileData });
    res.should.be.a("object").and.include.keys(["success", "code", "size"]);
    res.success.should.equal(true);
    code = res.code;
  });

  it("Pull file", async () => {
    const res = await fileProvider.getContent({ code });
  });

  it("Check if exists", async () => {
    const res = await fileProvider.status({ code });
  });

  it("Deleting", async () => {
    const res = await fileProvider.del({ code });
    res.success.should.equal(true);
  });
});
