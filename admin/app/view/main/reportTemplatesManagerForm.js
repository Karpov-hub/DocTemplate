Ext.define("Admin.view.main.reportTemplatesManagerForm", {
  extend: "Admin.view.main.BaseForm",
  xtype: "reportform",
  title: "Jasper report template",
  width: 750,
  height: 400,
  requires: [
    "Admin.view.main.reportTemplatesManagerFormController",
    "Admin.view.main.MultipleFiles"
  ],
  controller: "reportTemplatesManagerForm",
  items: [
    {
      xtype: "form",
      layout: "hbox",
      defaults: {
        flex: 1
      },
      items: [
        {
          xtype: "panel",
          layout: "anchor",
          defaults: {
            xtype: "textfield",
            labelWidth: 130,
            anchor: "100%"
          },
          items: [
            {
              name: "id",
              hidden: true
            },
            {
              name: "code",
              hidden: true
            },
            {
              name: "report_name_for_user",
              fieldLabel: "Report name",
              allowBlank: false
            },
            {
              name: "report_name_in_system",
              fieldLabel: "System report name",
              allowBlank: false,
              regex: /^[a-zA-Z_]+$/,
              invalidText: "Only letters without spaces"
            },
            {
              xtype: "panel",
              layout: "hbox",
              items: [
                Ext.create("Ext.form.field.File", {
                  name: "file",
                  allowBlank: true,
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
              name: "ctime",
              hidden: true
            }
          ]
        },
        // {
        //   xtype: "panel",
        //   layout: "anchor",
        //   margin: { left: 10 },
        //   defaults: {
        //     anchor: "100%"
        //   },
        //   items: [
        //     {
        //       xtype: "multiplefiles"
        //     }
        //   ]
        // }
      ]
    }
  ],
  buttons: [
    {
      text: "Save",
      action: "save"
    },
    { text: "Close", action: "close" }
  ]
});
