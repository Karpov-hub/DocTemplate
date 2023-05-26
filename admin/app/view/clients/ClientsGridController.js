Ext.define("Admin.view.main.ClientsGridController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.ClientsGridController",

  onItemSelected(el, record, element, rowIndex) {
    let recordData = {
      id: record.data.id,
      first_name: record.data.first_name,
      title: record.data.first_name,
      last_name: record.data.last_name,
      middle_name: record.data.middle_name,
      email: record.data.email,
      phone: record.data.phone,
      mtime: record.data.mtime,
      activated: record.data.activated,
      block: record.data.block,
    };
    this.showPanelAsScreen('Admin.view.clients.ClientsForm', {
      scope: this,
      recordData,
    });
  },

  async onDeleteRecord(grid, rowIndex, colIndex) {
    let name =
      grid.getStore().getAt(rowIndex).get("last_name") +
      " " +
      grid.getStore().getAt(rowIndex).get("first_name") +
      " " +
      grid.getStore().getAt(rowIndex).get("middle_name");

    await Ext.Msg.show({
      title: "Deleting",
      message:
        "Are you sure that you want to delete user profile " + name + "?",
      buttons: Ext.Msg.YESNO,
      icon: Ext.Msg.QUESTION,
      fn: (btn) => {
        if (btn === "yes") {
          this.callApi("client/profile/delete-client", {
            id: grid.getStore().getAt(rowIndex).get("id"),
          });
          this.view.getStore().removeAt(rowIndex);
          this.view.getStore().reload();
          Ext.toast("Client profile " + name + " was deleted");
        }
      },
    });
  },

  async changeClientBlockingstatus(grid, rowIndex, colIndex) {
    let status;
    let name =
      grid.getStore().getAt(rowIndex).get("last_name") +
      " " +
      grid.getStore().getAt(rowIndex).get("first_name") +
      " " +
      grid.getStore().getAt(rowIndex).get("middle_name");

    if (grid.getStore().getAt(rowIndex).get("block") === true) {
      status = "unblock";
    } else {
      status = "block";
    }
    await Ext.Msg.show({
      title: "Blocking",
      message: "Are you sure that you want to " + status + " user?",
      buttons: Ext.Msg.YESNO,
      icon: Ext.Msg.QUESTION,
      fn: (btn) => {
        if (btn === "yes") {
          this.callApi("client/profile/update-blocking-client", {
            id: grid.getStore().getAt(rowIndex).get("id"),
          });
          this.view.getStore().removeAt(rowIndex);
          this.view.getStore().reload();
          Ext.toast("Client " + name + " was " + status + "ed");
        }
      },
    });
  },

  async add() {
    this.showPanelAsScreen('Admin.view.clients.ClientsForm', {
      scope: this,
    });
  },
});
