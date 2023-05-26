Ext.define("Admin.store.GroupsStore", {
  extend: "Ext.data.Store",
  storeId: "groups",
  alias: "store.groups",
  autoLoad: true,
  model: "Admin.model.GroupsModel"
});
