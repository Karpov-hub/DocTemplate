Ext.define("Admin.store.MyOrdersStore", {
  extend: "Ext.data.Store",
  storeId: "myOrders",
  alias: "store.myOrders",
  autoLoad: true,
  model: "Admin.model.MyOrdersModel"
});
