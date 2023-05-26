Ext.define("Admin.view.roles.RolesForm", {
  extend: "Admin.view.main.BaseForm",

  xtype: "roleform",
  title: "Roles",
  width: 800,
  height: 600,
  requires: ["Admin.view.roles.RolesFormController"],
  controller: "RolesFormController",
  items: [
    {
      xtype: "form",
      layout: "anchor",
      items: [
        {
          xtype: "panel",
          layout: "anchor",
          defaults: {
            xtype: "textfield",
            anchor: "100%",
            labelWidth: 130
          },
          items: [
            {
              name: "id",
              hidden: true
            },
            {
              name: "name",
              fieldLabel: "Role name",
              allowBlank: false
            },
            {
              name: "ctime",
              hidden: true
            },
            {
              name: "modules",
              hidden: true
            }
          ]
        },
        {
          xtype: "gridpanel",
          scrollable: true,
          height: Ext.Element.getViewportHeight() * 0.33,
          action: "rules_modules",
          columns: [
            {
              dataIndex: "title",
              flex: 1,
              text: "Module name"
            },
            {
              dataIndex: "xtype",
              hidden: true
            },
            {
              dataIndex: "show_to_user",
              xtype: "checkcolumn",
              text: "Show to user",
              flex: 1
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
    { text: "Close", action: "close" }
  ]
});
