Ext.define("Admin.view.innerDocuments.InnerDocumentsGridController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.InnerDocumentsGridController",

  onItemSelected(el, record, element, rowIndex) {
    let recordData = {
      id: record.data.id,
      template: record.data.template,
      name: record.data.jasper_report_template.report_name_for_user,
      system_name: record.data.jasper_report_template.report_name_in_system,
      type: record.data.type,
      code: record.data.jasper_report_template.code,
      ctime: record.data.ctime,
      data_example: record.data.data_example,
      images:record.data.jasper_report_template.images
    };
    let window = this.openWindow(
      "Admin.view.innerDocuments.InnerDocumentsForm",
      { scope: this, recordData }
    );
    window.down("form").getForm().setValues(recordData);
    window.down("[name=json_editor]").setValue(record.data.data_example);
  },
  async onDeleteRecord(grid, rowIndex, colIndex) {
    await this.callApi("jasperService/removeTemplate", {
      id: grid.getStore().getAt(rowIndex).get("template")
    });
    this.view.getStore().removeAt(rowIndex);
    this.view.getStore().reload();
  },
  async add() {
    this.openWindow("Admin.view.innerDocuments.InnerDocumentsForm", {
      scope: this
    });
  },
  downloadTemplate: async function (grid, rowIndex) {
    if (grid.store.getAt(rowIndex).data.jasper_report_template.code)
      this.download(grid.store.getAt(rowIndex).data.jasper_report_template.code);
  },
});
