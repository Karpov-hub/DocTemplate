Ext.define("Admin.view.myOrders.MyOrdersFormController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.MyOrdersFormController",

  init() {
    this.view.getForm().setValues(this.view.recordData)
    this.callParent(arguments)
    this.view.down('[name=attached_files]').setData(this.view.recordData.attached_files.map(el => {
      return `<ol><a href ${globalThis.Admin.GlobalVariables.remoteUrl}/jasperReport/download?code=${el}>File</a></ol>`
    }));
  },

  control: {
    "[action=return]": {
      click: "changeStatus",
    },
    "[action=generate]": {
      click: "generate",
    },
  },

  closepanel() {
    Ext.History.clearViewConfig();
    Ext.History.back();
  },

  async changeStatus() {
    let data = {
      order_id: this.view.recordData.id,
      status: this.view.down('[name=status]').lastSelection[0].data.type,
    }

    if (data.status == 3 || data.status == 4) {
      let window = this.openWindow("Admin.view.myOrders.NoteForm", {
        scope: this,
        recordData: data,
      });
      window.down("form").getForm().setValues(data);
    }
    else {
      await this.callApi("order/change-order-status", data);
      this.closepanel();

    }
  },

  generate: async function () {
    let form = this.view.down("form").getForm();
    if (!form.isValid()) return Ext.toast("Validation error");
    let data = form.getValues();
    this.view
      .down("[name=data_example]")
      .setValue(this.view.down("[name=json_editor]").getValue());
    let file = this.view.down("[name=file]");
    let type = "";
    if (data.code) this.view.down("[name=file]").allowBlank = true;
    else if (
      file.fileInputEl.dom.files.length &&
      file.fileInputEl.dom.files[0].name.indexOf(".") >= 0
    )
      type = file.fileInputEl.dom.files[0].name.substr(
        file.fileInputEl.dom.files[0].name.indexOf(".")
      );
    else return Ext.toast("Validation error");
    if (data.code || type == ".jrxml" || type == ".jasper") {
      await this.submitForm(this, "/document/updateInnerDocuments");
      this.view.scope.view.getStore().reload();
    } else
      Ext.Msg.alert(
        "Wrong format of file",
        "File format must be .jasper or .jrxml"
      );
  },
});