Ext.define("Admin.view.clients.ClientsFormController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.ClientsFormController",

  init() {
    this.view.getForm().setValues(this.view.recordData)
    this.callParent(arguments)
  },

  control: {
    "[action=save]": {
      click: "save",
    },
    "[action=return]": {
      click: "closepanel",
    },
    "[action=save_return]": {
      click: "closepanel",
    },
  },

  async closepanelAndSave() {
    save(); closepanel();
  },

  closepanel() {
    Ext.History.clearViewConfig()
    Ext.History.back();
  },

  async save() {
    if (!this.view.down("form").getForm().isValid())
      return Ext.toast("Validation error");
    if (this.view.down("[name=ctime]").getValue() == "")
      this.view.down("[name=ctime]").setValue(new Date());
    let data = this.view.down("form").getForm().getValues();

    let result = await this.callAApi("client/profile/update-client", data);
    if (result.success) {
      this.view.scope.view.getStore().reload();
      return this.view.close();
    }
    return Ext.toast("Saving error");
  },
});