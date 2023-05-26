const router = require("./main.router");
const controller = require("../controller/client.controller");
const { captcha } = require("../middleware/recaptchav3");

router.post("/auth/signup_personal", captcha, controller.signup);
router.post("/auth/signup_business", captcha, controller.signup);
router.post("/auth/signin", captcha, controller.signin);
router.post("/auth/activate-profile", captcha, controller.activateProfile);
router.post("/auth/password-restore", captcha, controller.passwordRestore);
router.post(
  "/auth/password-restore-submit",
  captcha,
  controller.passwordRestoreSubmit
);
router.post("/auth/resend-otp", controller.resendOtp);
router.post("/auth/check-otp", controller.checkOtp);

router.post("/profile/get-clients", controller.getClients);
router.post("/profile/update-blocking-client", controller.updateBlockingClient);
router.post("/profile/update-client", controller.updateClient);
router.post("/profile/update-client-password", controller.updateClientPassword);
router.post("/profile/delete-client", controller.deleteClient);

router.post("/auth/cleanTest", controller.cleanTest);

module.exports = router;
