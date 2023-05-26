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
let id_category;

describe("Creating a category", () => {
  const path = "/category/create-category";
  it("should return code: SUCCESS if the category does not exist", async function () {
    const res = await request({
      path,
      data: { name: {}, description: {} }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("message").equal("Category was created");
    addToApiDoc(res, this.test);
  });

  it("should return the code: CATEGORYEXIST if the category already exists", async function () {
    const res = await request({
      path,
      data: { name: {}, description: {} }
    });
    res.body.should.have.property("code").equal("CATEGORYEXIST");
    addToApiDoc(res, this.test);
  });

  it("should return VALIDATIONSCHEMAERROR if the data format is incorrect", async function () {
    const res = await request({
      path,
      data: { name: "", description: "" }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });
});

describe("Getting category", async function () {
  const path = "/category/get-categories";
  it("should return VALIDATIONSCHEMAERROR if incorrect parameters are passed", async function () {
    const res = await request({
      path,
      data: { id: {} }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("should return a list of categories if there are no parameters", async function () {
    const res = await request({
      path,
      data: {}
    });
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("count");
    res.body.should.have.property("rows");
    addToApiDoc(res, this.test);
  });

  it("should return the list of categories if the parameters passed are correct", async function () {
    const res = await request({
      path,
      data: { start: 0, limit: 5, }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("count");
    res.body.should.have.property("rows");
    id_category = res.body.rows[0].id
    addToApiDoc(res, this.test);
  });

  it("should return the data of the selected category", async function () {
    const res = await request({
      path,
      data: { id: id_category }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("category");
    addToApiDoc(res, this.test);
  });
});

describe("Updating a category", async function () {
  const path = "/category/update-category";

  it("should return VALIDATIONSCHEMAERROR if no parameters are passed", async function () {
    const res = await request({
      path,
      data: {}
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("should return code: SUCCESS", async function () {
    const res = await request({
      path,
      data: { id: id_category, description: "description description" }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("message").equal("Category data was updated");
    addToApiDoc(res, this.test);
  });
});

/*
Написание теста get-templates отложено, так как не дописан
метод в самом контроллере
*/
// describe("Getting templates", async function () {
//   const path = "/category/get-templates";

//   it("should return code: SUCCESS", async function () {
//     const res = await request({
//       path,
//       data: { id: id_category, template_id: "" }
//     });
//     res.body.should.have.property("code").equal("SUCCESS");
//     res.body.should.have.property("message").equal("Template was binded to category");
//     addToApiDoc(res, this.test);
//   });
// });

describe("Category binding", async function () {
  const path = "/category/bindto-category";
  it("creating seeds of jasper_report_template", async function () {
    db.jasper_report_template.create({
      id: "c42d2ef8-05fb-4e3e-91e5-74d9f34f59ed",
    });
  });
  it("should return VALIDATIONSCHEMAERROR if no parameters are passed", async function () {
    const res = await request({
      path,
      data: {}
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("should return code: SUCCESS", async function () {
    const res = await request({
      path,
      data: { category_id: id_category, template_id: "c42d2ef8-05fb-4e3e-91e5-74d9f34f59ed" }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("message").equal("Template was binded to category");
    addToApiDoc(res, this.test);
  });

  it("removing the seeds of jasper_report_template", async function () {
    db.jasper_report_template.destroy({
      where: { id: "c42d2ef8-05fb-4e3e-91e5-74d9f34f59ed", },
    });
  });
});

describe("Deleting a category", async function () {
  const path = "/category/delete-category";

  it("should return VALIDATIONSCHEMAERROR if no parameters are passed", async function () {
    const res = await request({
      path,
      data: {}
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("should return VALIDATIONSCHEMAERROR if incorrect parameters are passed", async function () {
    const res = await request({
      path,
      data: { id: { id_category } }
    });
    res.body.status.should.equal("VALIDATIONSCHEMAERROR");
    addToApiDoc(res, this.test);
  });

  it("should return code: SUCCESS", async function () {
    const res = await request({
      path,
      data: { id: id_category }
    });
    res.body.should.have.property("code").equal("SUCCESS");
    res.body.should.have.property("message").equal("Category was deleted");
    addToApiDoc(res, this.test);
  });
});