const router = require("./main.router");

const controller = require("../controller/jasperService.controller.js");


router.post("/saveTemplate", controller.saveTemplate);
router.post("/getReport", controller.getReport);
router.post("/getReportTemplates", controller.getReportTemplates);
router.post("/removeTemplate", controller.removeTemplate);
router.post("/getReportInBuffer", controller.getReportInBuffer);
router.post("/getReportInBase64", controller.getReportInBase64);
router.post("/checkUniqueSystemReportName",controller.checkUniqueSystemReportName)
module.exports = router;

