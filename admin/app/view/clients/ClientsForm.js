Ext.define("Admin.view.clients.ClientsForm", {
  extend: "Ext.form.Panel",
  xtype: "clientsform",
  closeAction: "close",
  requires: ["Admin.view.clients.ClientsFormController"],
  controller: "ClientsFormController",
  tbar: [
    {
      iconCls: "x-fa fa-save",
      tooltip: "Save",
      action: "save",
      width: 50,
    },
    {
      iconCls: "x-fa fa-angle-left",
      tooltip: "Return",
      action: "return",
      width: 50,
    },
    {
      iconCls: "x-fa fa-angle-double-left",
      tooltip: "Save and Return",
      action: "save_return",
      width: 50,
    },
  ],

  scrollable: {
    y: 'scroll',
  },

  items: [
    {
      title: "Client",
      items: [{
        layout: 'column',
        defaults: {
          columnWidth: 0.5
        },
        items: [{
          bodyPadding: 50,
          defaults: {
            xtype: "textfield",
          },
          items: [
            {
              name: "last_name",
              fieldLabel: "Last name",
            },
            {
              name: "first_name",
              fieldLabel: "First name",
            },
            {
              name: "middle_name",
              fieldLabel: "Middle name",
              allowBlank: true,
            },
            {
              name: "activated",
              fieldLabel: "Activated",
              xtype: 'checkbox'
            },
          ],
        }, {
          bodyPadding: 50,
          defaults: {
            xtype: "textfield",
          },
          items: [
            {
              name: "email",
              fieldLabel: "Email",
            },
            {
              name: "phone",
              fieldLabel: "Phone",
              allowBlank: true,
            },
            {
              name: "block",
              fieldLabel: "Block",
              xtype: 'checkbox',
              allowBlank: true,
            },
          ],
        }],
      }],
    },
    {
      title: 'Client orders',
      items: [],
    }
  ]

});
