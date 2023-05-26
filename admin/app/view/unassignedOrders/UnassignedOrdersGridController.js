Ext.define("Admin.view.main.UnassignedOrdersGridController", {
  extend: "Admin.view.main.BaseController",
  alias: "controller.UnassignedOrdersGridController",

  init() {
    if (this.view.rolesStore) this.view.rolesStore.reload();
    this.callParent(arguments);
  },

  onItemSelected(el, record, element, rowIndex) {
    let recordData = record.data;
    recordData.client = record.data.client.last_name + " " + record.data.client.first_name + " " + record.data.client.middle_name;

    let window = this.openWindow("Admin.view.unassignedOrders.UnassignedOrdersForm", {
      scope: this,
      recordData,
    });
    window.down("form").getForm().setValues(record.data);
  },
});
