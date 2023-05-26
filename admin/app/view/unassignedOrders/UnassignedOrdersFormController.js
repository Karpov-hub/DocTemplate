Ext.define("Admin.view.unassignedOrders.UnassignedOrdersFormController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.UnassignedOrdersFormController",

  init() {
    this.view.down('[name=attached_files]').setData(this.view.recordData.attached_files.map(el => {
      return `<ol><a href ${globalThis.Admin.GlobalVariables.remoteUrl}/jasperReport/download?code=${el}>File</a></ol>`
    }));
  },

  control: {
    "[action=close]": {
      click: "closeform"
    },
    "[action=assign_to_me]": {
      click: "assign_to_me"
    },
  },

  closeform() {
    this.view.close();
  },

  async assign_to_me() {
    await this.callApi("order/apply-order-to-operator", {
      order_id: this.view.down("[name=id]").getValue(),
      token: localStorage.getItem("auth_token")
    });
    this.view.close();
    Ext.toast("Added to My Orders");
  },
});
