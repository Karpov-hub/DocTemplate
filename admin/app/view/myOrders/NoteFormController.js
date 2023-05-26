Ext.define("Admin.view.myOrders.NoteFormController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.NoteFormController",

  init() {
    if (this.view.recordData.status == 3) {
      this.view.down('[name=title]').setData("To continue, add a note for the Order:");
    } else if (this.view.recordData.status == 4) {
      this.view.down('[name=title]').setData("To continue, add the reason Rejected:");
    }
  },

  control: {
    "[action=cancel]": {
      click: "closeform"
    },
    "[action=continue]": {
      click: "changeStatus"
    },
  },

  closeform() {
    this.view.close();
  },

  async changeStatus() {
    let data = this.view.recordData
    if (this.view.down("[name=note]").getValue() != "") {
      data.note = this.view.down("[name=note]").getValue()
      await this.callApi("order/change-order-status", data);
      this.closeform();
      Ext.History.clearViewConfig();
      Ext.History.back();
    }
    else {
      Ext.toast("Fill in the required field!");
    }
  },
});
