const router = require("./main.router");

const controller = require("../controller/document.controller");

router.post("/getInnerDocuments", controller.getInnerDocuments);
router.post("/updateInnerDocuments", controller.updateInnerDocuments);

module.exports = router;
