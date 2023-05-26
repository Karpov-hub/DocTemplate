Ext.define("Admin.view.users.UsersGridController", {
  extend: "Admin.view.main.BaseController",
  alias: "controller.UsersGridController",

  init() {
    if (this.view.rolesStore) this.view.rolesStore.reload();
    this.callParent(arguments);
  },
  onItemSelected(el, record, element, rowIndex) {
    let window = this.openWindow("Admin.view.roles.UsersForm", {
      scope: this,
      recordData: record.data
    });
    window.down("form").getForm().setValues(record.data);
  },
  add() {
    this.openWindow("Admin.view.roles.UsersForm", { scope: this });
  },
  async onDeleteRecord(grid, rowIndex, colIndex) {
    await this.callApi("user/removeUser", {
      id: grid.getStore().getAt(rowIndex).get("id")
    });
    this.view.getStore().removeAt(rowIndex);
    this.view.getStore().reload();
  }
});
