Ext.define("Admin.store.UsersStore", {
  extend: "Ext.data.Store",
  storeId: "users",
  alias: "store.users",
  autoLoad: true,
  model: "Admin.model.UsersModel"
});
