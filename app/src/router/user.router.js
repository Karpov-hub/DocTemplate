const router = require("./main.router");
const controller = require("../controller/user.controller");

router.post("/getPermissions", controller.getPermissions);
router.post("/updatePermissions", controller.updatePermissions);
router.post("/removePermission", controller.removePermission);

router.post("/getUsers", controller.getUsers)
router.post("/updateUsers", controller.updateUsers)
router.post("/removeUser", controller.removeUser)
router.post("/blockUser", controller.blockUser)


module.exports = router;
