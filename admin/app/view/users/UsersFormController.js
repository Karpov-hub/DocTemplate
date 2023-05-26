Ext.define("Admin.view.users.UsersFormController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.UsersFormController",

  init() {
    if (this.view.recordData && this.view.recordData.id) {
      if (this.view.recordData.block)
        return this.view.down("[action=unblock]").setVisible(true);
      return this.view.down("[action=block]").setVisible(true);
    }
  },
  control: {
    "[action=close]": {
      click: "closeform"
    },
    "[action=save]": {
      click: "save"
    },
    "[action=block]": {
      click: "block"
    },
    "[action=unblock]": {
      click: "block"
    }
  },
  async block() {
    let data = this.view.down("form").getForm().getValues();
    let body = { id: data.id, action: "" };
    if (data.block) body.action = "unblock";
    else body.action = "block";
    let res = await this.callApi("user/blockUser", body);
    if (res.success) {
      if (body.action == "block") {
        Ext.toast("User blocked");
        this.view.down("[name=block]").setValue(true);
        this.view.down("[action=block]").setVisible(false);
        this.view.down("[action=unblock]").setVisible(true);
      } else {
        Ext.toast("User unblocked");
        this.view.down("[name=block]").setValue(false);
        this.view.down("[action=block]").setVisible(true);
        this.view.down("[action=unblock]").setVisible(false);
      }

      return this.view.scope.view.getStore().reload();
    }
    return Ext.toast("Cannot performe this action");
  },
  closeform: function () {
    this.view.close();
  },
  save: async function () {
    if (!this.view.down("form").getForm().isValid())
      return Ext.toast("Validation error");
    if (this.view.down("[name=ctime]").getValue() == "")
      this.view.down("[name=ctime]").setValue(new Date());
    let data = this.view.down("form").getForm().getValues();
    let result = await this.callApi("user/updateUsers", data);
    if (result.success) {
      this.view.scope.view.getStore().reload();
      return this.view.close();
    }
    return Ext.toast("Saving error");
  }
});
