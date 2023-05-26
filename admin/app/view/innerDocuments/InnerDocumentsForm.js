Ext.define("Admin.view.innerDocuments.InnerDocumentsForm", {
  extend: "Admin.view.main.BaseForm",

  xtype: "innerdocumentsform",
  title: "Inner document",
  requires: [
    "Admin.view.innerDocuments.InnerDocumentsFormController",
    "Admin.view.main.MultipleFiles",
    "Ext.form.field.File",
    "Admin.JSONEditor"
  ],
  controller: "InnerDocumentsFormController",
  items: [
    {
      xtype: "tabpanel",
      layout: "anchor",
      items: [
        {
          title: "Template config",
          xtype: "form",
          layout: "border",
          height: Math.floor(Ext.Element.getViewportHeight() * 0.7),
          items: [
            {
              title: "General",
              xtype: "panel",
              layout: "anchor",
              region: "west",
              collapsible: true,
              margin: { right: 10 },
              defaults: {
                xtype: "textfield",
                anchor: "100%",
                labelWidth: 130,
                margin: 10
              },
              items: [
                {
                  name: "id",
                  hidden: true
                },
                {
                  name: "template",
                  hidden: true
                },
                {
                  name: "name",
                  fieldLabel: "Name",
                  allowBlank: false
                },
                {
                  name: "system_name",
                  fieldLabel: "Name in system",
                  allowBlank: false,
                  regex: /^[a-zA-Z_]+$/,
                  invalidText: "Only letters without spaces"
                },
                {
                  xtype: "combobox",
                  displayField: "label",
                  valueField: "type",
                  name: "type",
                  fieldLabel: "Doc type",
                  allowBlank: false,
                  store: {
                    fields: ["type"],
                    data: [
                      { label: "PDF", type: "Pdf" },
                      { label: "DOCX", type: "Docx" },
                      { label: "XLSX", type: "Xlsx" }
                    ]
                  }
                },
                {
                  xtype: "panel",
                  layout: "hbox",
                  items: [
                    Ext.create("Ext.form.field.File", {
                      name: "file",
                      allowBlank: false,
                      flex: 1,
                      labelWidth: 130,
                      fieldLabel: "Upload new template"
                    }),
                    {
                      margin: "0 0 0 10",
                      xtype: "button",
                      hidden: true,
                      action: "downloadTemplate",
                      iconCls: "x-fa fa-cloud-download-alt"
                    }
                  ]
                },
                {
                  name: "code",
                  hidden: true
                },
                {
                  name: "ctime",
                  hidden: true
                },
                // {
                //   xtype: "multiplefiles",
                //   width:Math.floor(Ext.Element.getViewportHeight() * 0.6)
                // }
              ]
            },
            {
              title: "Data example",
              xtype: "panel",
              layout: "fit",
              region: "center",
              items: [
                {
                  xtype: "panel",
                  layut: "anchor",
                  items: [
                    {
                      options: {
                        mode: "code",
                        enableSort: false,
                        enableTransform: false
                      },
                      margin: 0,
                      xtype: "jsoneditor",
                      allowBlank: "false",
                      name: "json_editor"
                    },
                    {
                      xtype: "textfield",
                      hidden: true,
                      name: "data_example"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          xtype: "panel",
          layout: "fit",
          title: "Preview",
          items: [
            {
              xtype: "panel",
              action: "example_form",
              height: Math.floor(Ext.Element.getViewportHeight() * 0.7),
              scrollable: {
                y: true
              },
              margin: { top: 10 },
              layout: { type: "vbox", align: "stretch" },
              items: []
            }
          ]
        }
      ]
    }
  ],
  buttons: [
    {
      text: "Save",
      action: "save"
    },
    {
      text: "Save and close",
      action: "save_and_close"
    },
    { text: "Close", action: "close" }
  ],

  setValues: function (data) {
    this.callParent(arguments)
  }
});
