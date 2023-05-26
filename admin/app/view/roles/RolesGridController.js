Ext.define("Admin.view.roles.RolesGridController", {
  extend: "Admin.view.main.BaseController",
  alias: "controller.RolesGridController",

  onItemSelected(el, record, element, rowIndex) {
    let window = this.openWindow("Admin.view.roles.RolesForm", {
      scope: this,
      recordData: record.data
    });
    window.down("form").getForm().setValues(record.data);
  },
  add() {
    this.openWindow("Admin.view.roles.RolesForm", { scope: this });
  },
  async onDeleteRecord(grid, rowIndex, colIndex) {
    await this.callApi("user/removePermission", {
      id: grid.getStore().getAt(rowIndex).get("id")
    });
    this.view.getStore().removeAt(rowIndex);
    this.view.getStore().reload();
  }
});
