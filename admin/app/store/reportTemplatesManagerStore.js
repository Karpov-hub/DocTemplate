Ext.define("Admin.store.reportTemplatesManagerStore", {
  extend: "Ext.data.Store",
  storeId: "reportTemplatesManager",
  alias: "store.reportTemplatesManager",
  model: "Admin.model.reportTemplatesManagerModel",

  remoteFilter: true,
  remoteSort: true,
  autoLoad: true
});
