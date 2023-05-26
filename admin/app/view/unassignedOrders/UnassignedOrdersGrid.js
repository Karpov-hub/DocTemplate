Ext.define("Admin.view.unassignedOrders.UnassignedOrdersGrid", {
  extend: "Admin.view.main.BaseGrid",
  xtype: "unassignedOrdersGrid",

  requires: ["Admin.store.UnassignedOrdersStore", "Admin.view.unassignedOrders.UnassignedOrdersForm"],

  title: "Orders",

  store: {
    type: "unassignedOrders",
  },

  controller: "UnassignedOrdersGridController",

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
      width: 200,
      dataIndex: "ctime",
      xtype: "datecolumn",
      text: "Creation date",
      sortable: true,
      format: "d.m.Y H:i:s",
      filter: {
        xtype: "datefield",
        format: "d.m.Y",
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
