Ext.define("Admin.view.filters.GroupsGrid", {
  extend: "Admin.view.filters.CategoriesGrid",

  requires: [
    "Admin.store.GroupsStore",
  ],

  store: {
    type: "groups"
  },
});
