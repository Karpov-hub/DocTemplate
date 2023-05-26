Ext.define("Admin.view.filters.LifeSituationsGrid", {
  extend: "Admin.view.filters.CategoriesGrid",

  requires: [
    "Admin.store.LifeSituationsStore",
  ],

  store: {
    type: "life_situations"
  },
});
