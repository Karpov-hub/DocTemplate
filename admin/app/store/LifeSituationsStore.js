Ext.define("Admin.store.LifeSituationsStore", {
  extend: "Ext.data.Store",
  storeId: "life_situations",
  alias: "store.life_situations",
  autoLoad: true,
  model: "Admin.model.LifeSituationsModel"
});
