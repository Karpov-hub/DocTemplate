Ext.define("Admin.store.CategoriesStore", {
  extend: "Ext.data.Store",
  storeId: "categories",
  alias: "store.categories",
  autoLoad: true,
  model: "Admin.model.CategoriesModel"
});
