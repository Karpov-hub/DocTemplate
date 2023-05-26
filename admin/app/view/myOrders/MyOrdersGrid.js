Ext.define("Admin.view.myOrders.MyOrdersGrid", {
  extend: "Admin.view.main.BaseGrid",
  xtype: "myOrdersGrid",

  requires: ["Admin.store.MyOrdersStore", "Admin.view.myOrders.MyOrdersForm"],

  title: "My Orders",

  store: {
    type: "myOrders",
  },

  controller: "MyOrdersGridController",

  tbar: [
    {
      text: "Refresh",
      iconCls: "x-fa fa-redo",
      scale: "medium",
      handler: "refresh",
    },
  ],
  columns: [
    {
      dataIndex: "id",
      hidden: true,
    },
    {
      dataIndex: "full_name",
      text: "Full name",
      flex: 1,
      sortable: true,
      filter: true,
      renderer(v, m, r) {
        return `${r.data.client.last_name} ${r.data.client.first_name} ${r.data.client.middle_name || ""
          }`;
      },
    },
    {
      dataIndex: "template_name",
      text: "Template name",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      align: "center",
      dataIndex: "ctime",
      xtype: "datecolumn",
      text: "Registration date",
      flex: 1,
      sortable: true,
      format: "d.m.Y H:i:s",
      filter: {
        xtype: "datefield",
        format: "d.m.Y",
      },
    },
    {
      align: "center",
      dataIndex: "status",
      text: "Status",
      width: 200,
      sortable: true,
      filter: true,
      renderer(v, m, r) {
        if (r.data.status == 0)
          return "To do"
        else if (r.data.status == 1)
          return "In progress"
        else if (r.data.status == 2)
          return "Done"
        else if (r.data.status == 3)
          return "Need to clarify"
        else if (r.data.status == 4)
          return "Rejected"
      },
    },
    {
      dataIndex: "requirements",
      text: "Requirements",
      hidden: true,
    },
    {
      dataIndex: "attached_files",
      text: "Attached Files",
      hidden: true,
    },
  ],
  bbar: {
    xtype: "pagingtoolbar",
    displayInfo: true,
  },

  listeners: {
    rowdblclick: "onItemSelected",
  },
});
