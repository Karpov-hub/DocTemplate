Ext.define("Admin.store.RolesStore", {
    extend: "Ext.data.Store",
    storeId: "roles",
    alias: "store.roles",
    autoLoad: true,
    model: "Admin.model.RolesModel"
  });
  