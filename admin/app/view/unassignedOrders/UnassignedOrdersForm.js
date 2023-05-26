Ext.define("Admin.view.unassignedOrders.UnassignedOrdersForm", {
  extend: "Admin.view.main.BaseForm",

  xtype: "unassignedOrdersform",
  title: "Order",
  width: 800,
  height: 450,
  requires: ["Admin.view.unassignedOrders.UnassignedOrdersFormController"],
  controller: "UnassignedOrdersFormController",
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
          name: "client",
          fieldLabel: "Client",
          allowBlank: false,
          readOnly: true,
        },
        {
          name: "template_name",
          fieldLabel: "Template name",
          allowBlank: false,
          readOnly: true,
        },
        {
          name: "requirements",
          fieldLabel: "Requirements",
          readOnly: true,
        },
        {
          title: "Attached Files",
          xtype: "panel",
          name: "attached_files",
          height: 160,
          border: true,
          scrollable: {
            y: 'scroll',
          },
        },
      ]
    }
  ],
  buttons: [
    {
      text: "Assign to me",
      iconCls: "fa fa-ban",
      action: "assign_to_me",
    },
    { text: "Close", action: "close" }
  ],
});
