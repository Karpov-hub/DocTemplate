Ext.define("Admin.view.main.CustomFileInput", {
  override: "Ext.form.field.File",

  onRender: function () {
    this.callParent(arguments);
    this.fileInputEl.dom.setAttribute("multiple", this.multiple);
  },

  getFileList: function () {
    return this.fileInputEl.dom.files;
  },

  removeAll() {
    return (this.fileInputEl.dom.files = null);
  }
});
Ext.define("Admin.view.main.MultipleFiles", {
  extend: "Ext.panel.Panel",
  xtype: "multiplefiles",
  require: ["Ext.form.field.FileButton", "Ext.form.field.File"],
  name: null,
  items: [
    {
      xtype: "panel",
      layout: "hbox",
      items: [
        {
          xtype: "filefield",
          name: "files_list",
          width: 62,
          accept: "image/*",
          multiple: true,
          hideLabel: true,
          buttonOnly: true,
          buttonText: "Upload",
          listeners: {
            change(el) {
              let files = [...el.getFileList()];
              let store_array = [];
              for (let file of files) {
                let file_name = file.name.split(".");
                if (
                  file_name[file_name.length - 1] != "png" &&
                  file_name[file_name.length - 1] != "bmp" &&
                  file_name[file_name.length - 1] != "jpg"
                ) {
                  el.removeAll();
                  return Ext.Msg.alert(
                    "Error",
                    "Wrong format for picture (supported png, jpg, bmp)"
                  );
                }
                store_array.push({ file: file.name });
              }
              if (el.ownerCt.ownerCt.down("[name=images_codes]").getValue()) {
                let old_files = JSON.parse(
                  el.ownerCt.ownerCt.down("[name=images_codes]").getValue()
                );
                store_array = store_array.concat(
                  old_files.map((el) => {
                    return { file: el.name };
                  })
                );
              }
              el.ownerCt.ownerCt
                .down("[action=files_list]")
                .setStore(store_array);
            }
          }
        },
        {
          margin: { left: 10 },
          labelWidth: 75,
          xtype: "checkbox",
          fieldLabel: "Delete old",
          name: "delete_old"
        }
      ]
    },
    {
      xtype: "textfield",
      name: "images_codes",
      hidden: true
    },
    {
      margin: "10 0 0 0",
      xtype: "gridpanel",
      action: "files_list",
      store: [],
      columns: [
        {
          dataIndex: "file",
          text: "Loaded files",
          flex: 1
        }
      ]
    }
  ]
});
