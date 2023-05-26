const router = require("./main.router");
const controller = require("../controller/order.controller");

router.post("/create-order", controller.createOrder);
router.post("/get-order", controller.getOrders);
router.post("/apply-order-to-operator", controller.applyOrderToOperator);
router.post("/change-order-status", controller.changeOrderStatus);
router.post("/complete-order", controller.completeOrder);

module.exports = router;
