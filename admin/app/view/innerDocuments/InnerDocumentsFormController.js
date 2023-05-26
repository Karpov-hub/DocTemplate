Ext.define("Admin.view.innerDocuments.InnerDocumentsFormController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.InnerDocumentsFormController",

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
    "[action=save_and_close]": {
      click: "saveAndClose"
    },
    "[action=downloadTemplate]": {
      click: "downladTemplate"
    },
    "[xtype=tabpanel]": {
      beforetabchange: function (tabs, newTab, oldTab) {
        if (newTab.title == "Preview") this.updateExampleForm();
      }
    },
    "[name=code]": {
      change: "showDownloadIfCodeExists"
    }
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
  saveAndClose: function () {
    this.saveData(true);
  },
  save: function () {
    this.saveData(false);
  },
  saveData: async function (closeForm) {
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
      if (closeForm) this.view.close();
    } else
      Ext.Msg.alert(
        "Wrong format of file",
        "File format must be .jasper or .jrxml"
      );
  },
  updateExampleForm() {
    let panel = this.view.down("[action=example_form]");
    panel.removeAll(true);
    try {
      let source_object = JSON.parse(
        this.view.down("[name=json_editor]").getValue()
      );
      if (!Ext.Object.isEmpty(source_object)) {
        for (let key of Object.keys(source_object)) {
          if (
            !source_object[key].value ||
            typeof source_object[key].value == "string"
          )
            this.addTextField(panel, key, source_object[key]);
          if (Array.isArray(source_object[key].value)) {
            this.addGridPanel(panel, key, source_object[key]);
          }
          if (typeof source_object[key].value == "number")
            this.addNumberField(panel, key, source_object[key]);
        }
        panel.add({
          xtype: "panel",
          margin: { top: 30 },
          layout: "anchor",
          items: [
            {
              xtype: "button",
              position: "end",
              anchor: "20%",
              text: "Generate example",
              handler: "generateExampleDocument"
            }
          ]
        });
      }
    } catch (e) {
      Ext.toast("Invalid json, fix and try again");
    }
  },
  addNumberField(panel, key, obj) {
    return panel.add({
      xtype: "numberfield",
      hideTrigger: true,
      keyNavEnabled: false,
      mouseWheelEnabled: false,
      name: key,
      fieldLabel: obj.title,
      value: obj.value
    });
  },
  onDeleteRecord(grid, rowIndex) {
    grid.getStore().removeAt(rowIndex);
  },
  addGridPanel(panel, key, obj) {
    let columns = [];
    for (let col of Object.keys(obj.items))
      columns.push({
        dataIndex: col,
        text: obj.items[col],
        flex: 1,
        editor: {
          completeOnEnter: true,
          field: {
            xtype: "textfield"
          }
        }
      });
    columns.push({
      xtype: "actioncolumn",
      width: 25,
      items: [
        {
          iconCls: "x-fa fa-trash",
          tooltip: "Delete",
          handler: "onDeleteRecord"
        }
      ]
    });
    return panel.add({
      title: obj.title,
      xtype: "gridpanel",
      store: Ext.create("Ext.data.Store", {
        data: obj.value
      }),
      name: key,
      columns,
      tbar: [
        {
          text: "Add",
          tooltip: "Add new record",
          iconCls: "x-fa fa-plus",
          scale: "small",
          handler: "addRow"
        }
      ],
      plugins: {
        cellediting: {
          clicksToEdit: 2
        }
      }
    });
  },
  addTextField(panel, name, obj) {
    return panel.add({
      xtype: "textfield",
      name,
      fieldLabel: obj.title,
      value: obj.value
    });
  },
  addRow(el) {
    el.ownerCt.ownerCt.getStore().insert(0, {});
  },
  async generateExampleDocument() {
    let request_object = await this.buildDataBeforeDownloading();
    let generated_document = await this.callApi(
      "jasperService/getReportInBase64",
      request_object
    );
    if (generated_document && generated_document.file) {
      let link = document.createElement("a");
      link.href = `data:application/octet-stream;base64,${generated_document.file}`;
      link.download = `${
        request_object.report_name
      }-${new Date().toLocaleDateString()}.${request_object.report_format}`;
      return link.click();
    }
    return Ext.toast("Cannot generate document");
  },
  async buildDataBeforeDownloading() {
    let form_data = this.view.down("form").getForm().getValues();
    let request_object = {
      report_name: form_data.system_name,
      report_format: form_data.type.toLowerCase(),
      report_data: {}
    };
    try {
      let source_object = JSON.parse(
        this.view.down("[name=json_editor]").getValue()
      );
      for (let key of Object.keys(source_object)) {
        let component_data = this.view.down(`[name=${key}]`);
        if (component_data.store) {
          let grid_records = component_data.getStore().data.items;
          request_object.report_data[key] = [];
          for (let item of grid_records) {
            if (item.data.id && item.data.id.includes("extModel"))
              delete item.data.id;
            request_object.report_data[key].push(item.data);
          }
        } else request_object.report_data[key] = component_data.getValue();
      }
      return request_object;
    } catch (e) {
      console.log(e);
      Ext.toast("Cannot generate", "Check entered data and try again");
    }
  }
});
