Ext.define("Admin.view.main.reportTemplatesManagerGridController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.reportTemplatesManagerGrid",

  init() {
    let store = this.view.getStore();
    store.clearFilter(true);
  },

  onItemSelected(el, record, element, rowIndex) {
    let window = this.openWindow("Admin.view.main.reportTemplatesManagerForm", {
      scope: this,
      recordData: record.data
    });

    window.down("form").getForm().setValues(record.data);
  },
  async onDeleteRecord(grid, rowIndex, colIndex) {
    await this.callApi("jasperService/removeTemplate", {
      id: grid.getStore().getAt(rowIndex).get("id")
    });
    this.view.getStore().removeAt(rowIndex);
    this.view.getStore().reload();
  },
  async add() {
    this.openWindow("Admin.view.main.reportTemplatesManagerForm", {
      scope: this
    });
  },
  downloadTemplate: async function (grid, rowIndex) {
    if (grid.store.getAt(rowIndex).data.code)
      this.download(grid.store.getAt(rowIndex).data.code);
  }
});
