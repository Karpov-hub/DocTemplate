Ext.define("Admin.store.ClientsStore", {
    extend: "Ext.data.Store",
    storeId: "clients",
    alias: "store.clients",
    autoLoad: true,
    model: "Admin.model.ClientsModel"
  });
  