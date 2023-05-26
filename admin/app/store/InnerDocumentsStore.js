Ext.define("Admin.store.InnerDocumentsStore", {
  extend: "Ext.data.Store",
  storeId: "inner_documents",
  alias: "store.inner_documents",
  autoLoad: true,
  model: "Admin.model.InnerDocumentsModel"
});
