Ext.define("Admin.view.main.MyOrdersGridController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.MyOrdersGridController",

  onItemSelected(el, record, element, rowIndex) {
    let recordData = {
      id: record.data.id,
      full_name: record.data.client.last_name + " " + record.data.client.first_name + " " + record.data.client.middle_name,
      template_name: record.data.template_name,
      ctime: record.data.ctime,
      status: record.data.status,

      requirements: record.data.requirements,
      attached_files: record.data.attached_files,
    };
    this.showPanelAsScreen('Admin.view.myOrders.MyOrdersForm', {
      scope: this,
      recordData,
    });
  },
});
