Ext.define("Admin.view.main.reportTemplatesManagerFormController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.reportTemplatesManagerForm",

  init() {
    let arr = [];
    if (this.view.recordData && this.view.recordData.images) {
      for (let img of this.view.recordData.images) {
        arr.push({ file: img.name });
      }
      // this.view.down("[action=files_list]").setStore(arr);
      // this.view
      //   .down("[name=images_codes]")
      //   .setValue(JSON.stringify(this.view.recordData.images));
    }
  },
  control: {
    "[action=close]": {
      click: "closeform"
    },
    "[action=save]": {
      click: "save"
    },
    "[action=downloadTemplate]": {
      click: "downladTemplate"
    },
    "[name=code]": {
      change: "showDownloadIfCodeExists"
    },
    "[name=report_name_in_system]": {
      focusleave: "checkUniqueSysReportName"
    }
  },
  checkUniqueSysReportName: async function (el) {
    let result = await this.callApi(
      "jasperService/checkUniqueSystemReportName",
      { name: el.lastValue, id: this.view.down("[name=id]").getValue() }
    );
    if (!result.unique) el.markInvalid("Name is already exist");
    else el.isValid()
    return result
  },
  showDownloadIfCodeExists: function (el, v) {
    if (v) this.view.down("[action=downloadTemplate]").setVisible(true);
  },
  closeform: function () {
    this.view.close();
  },
  downladTemplate: function () {
    this.download(this.view.down("[name=code]").getValue());
  },
  save: async function () {
    if (this.view.down("[name=ctime]").getValue() == "")
      this.view.down("[name=ctime]").setValue(new Date());
    let code = this.view.down("[name=code]").getValue();
    let type = "";

    // if (this.view.down("[name=delete_old]").getValue())
    //   this.view.down("[name=images_codes]").setValue("");
    if (code) this.view.down("[name=file]").allowBlank = true;
    else {
      this.view.down("[name=file]").allowBlank = false;
      let file = this.view.down("[name=file]");
      if (file.fileInputEl.dom.files[0] && file.fileInputEl.dom.files[0].name.indexOf(".") >= 0)
        type = file.fileInputEl.dom.files[0].name.substr(
          file.fileInputEl.dom.files[0].name.indexOf(".")
        );
    }
    if (!this.view.down("form").getForm().isValid())
      return Ext.toast("Validation error");
    let uniqueField = await this.checkUniqueSysReportName(this.view.down('[name=report_name_in_system]'))
    if(!uniqueField.unique) return Ext.toast("System report name must be unique");
    if (code || type == ".jrxml" || type == ".jasper") {
      await this.submitForm(this, "/jasperService/saveTemplate");
      this.view.scope.view.getStore().reload();
      this.view.close();
    } else
      Ext.Msg.alert(
        "Wrong format of file",
        "File format must be .jasper or .jrxml"
      );
  }
});
