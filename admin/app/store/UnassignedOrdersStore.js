Ext.define("Admin.store.UnassignedOrdersStore", {
  extend: "Ext.data.Store",
  storeId: "unassignedOrders",
  alias: "store.unassignedOrders",
  autoLoad: true,
  model: "Admin.model.UnassignedOrdersModel"
});
