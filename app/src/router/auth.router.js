const router = require("./main.router");
const controller = require("../controller/auth.controller");

router.post("/signin", controller.signin);
router.post("/getUserData", controller.getUserData);
router.post("/refreshToken", controller.refreshToken);
router.post("/logout", controller.logout);

module.exports = router;
