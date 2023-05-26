Ext.define("Admin.view.roles.RolesFormController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.RolesFormController",

  init() {
    let menu_data = Ext.create("Admin.menu");
    let menu = menu_data.items.map((el) => {
      return {
        title: el.title,
        xtype: el.items[0].xtype
      };
    });
    for (let item of menu) {
      if (
        this.view.recordData &&
        this.view.recordData.modules &&
        this.view.recordData.modules.find((el) => {
          return el.xtype == item.xtype;
        })
      )
        item.show_to_user = true;
    }
    this.view.down("[action=rules_modules]").setStore(menu);
  },
  control: {
    "[action=close]": {
      click: "closeform"
    },
    "[action=save]": {
      click: "save"
    }
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
    let grid_data = this.view.down("[action=rules_modules]").getStore()
      .data.items;
    grid_data = grid_data
      .filter((el) => {
        if (el.data.show_to_user) return true;
      })
      .map((el) => {
        return {
          title: el.data.title,
          xtype: el.data.xtype
        };
      });
    let result = await this.callApi("user/updatePermissions", {
      id: data.id,
      name: data.name,
      ctime: data.ctime,
      permissions_array: grid_data
    });
    if (result.success) {
      this.view.scope.view.getStore().reload();
      return this.view.close();
    }
    return Ext.toast("Saving error");
  }
});
