Ext.define("Admin.view.roles.UsersForm", {
  extend: "Admin.view.main.BaseForm",

  xtype: "userform",
  title: "User",
  width: 600,
  height: 350,
  requires: ["Admin.view.users.UsersFormController"],
  controller: "UsersFormController",
  items: [
    {
      xtype: "form",
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
          fieldLabel: "User name",
          allowBlank: false
        },
        {
          name: "login",
          fieldLabel: "Login",
          allowBlank: false
        },
        {
          name: "password",
          fieldLabel: "Password",
          allowBlank: false
        },
        {
          xtype: "combobox",
          displayField: "name",
          valueField: "id",
          name: "role",
          fieldLabel: "Role",
          allowBlank: false,
          store: Ext.create("Admin.store.RolesStore")
        },
        {
          name: "ctime",
          hidden: true
        },
        {
          xtype:'checkbox',
          name: "block",
          hidden: true
        }
      ]
    }
  ],
  buttons: [
    {
      text: "Block",
      iconCls: "fa fa-ban",
      action: "block",
      hidden: true
    },
    {
      text: "Unblock",
      iconCls: "fa fa-check",
      action: "unblock",
      hidden: true
    },
    {
      text: "Save",
      action: "save"
    },
    { text: "Close", action: "close" }
  ]
});
