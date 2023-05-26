const router = require("./main.router");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  bindToCategory,
  getTemplates
} = require("../controller/category.controller");

router.post("/create-category", createCategory);
router.post("/update-category", updateCategory);
router.post("/delete-category", deleteCategory);
router.post("/bindto-category", bindToCategory);
router.post("/get-categories", getCategories);
router.post("/get-templates", getTemplates);

module.exports = router;
