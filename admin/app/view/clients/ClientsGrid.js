Ext.define("Admin.view.clients.ClientsGrid", {
  extend: "Admin.view.main.BaseGrid",
  xtype: "clientsGrid",

  requires: ["Admin.store.ClientsStore", "Admin.view.clients.ClientsForm"],

  title: "Clients",

  store: {
    type: "clients",
  },

  controller: "ClientsGridController",

  tbar: [
    {
      text: "Add",
      tooltip: "Add new record",
      iconCls: "x-fa fa-plus",
      scale: "medium",
      handler: "add",
    },
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
      flex: 1,
      hidden: true,
    },
    {
      dataIndex: "first_name",
      flex: 1,
      hidden: true,
    },
    {
      dataIndex: "last_name",
      flex: 1,
      hidden: true,
    },
    {
      dataIndex: "middle_name",
      flex: 1,
      hidden: true,
    },
    {
      dataIndex: "full_name",
      text: "Full name",
      flex: 1,
      sortable: true,
      filter: true,
      renderer(v, m, r) {
        return `${r.data.last_name} ${r.data.first_name} ${r.data.middle_name || ""
          }`;
      },
    },
    {
      dataIndex: "email",
      text: "Email",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      dataIndex: "phone",
      text: "Phone",
      width: 130,
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
      dataIndex: "block",
      text: "Blocked",
      width: 80,
      sortable: true,
      filter: true,
      xtype: "actioncolumn",
      items: [
        {
          iconCls: "x-fa fa-check",
          tooltip: "Unblock user",
          handler: "changeClientBlockingstatus",
          isDisabled: (grid, rowIdx, colIdx, items, record) => {
            return !record.data.block;
          },
        },
        {
          iconCls: "x-fa fa-ban",
          tooltip: "Block user",
          handler: "changeClientBlockingstatus",
          isDisabled: (grid, rowIdx, colIdx, items, record) => {
            return record.data.block;
          },
        },
      ],
    },
    {
      xtype: "actioncolumn",
      width: 50,
      align: "center",
      items: [
        {
          iconCls: "x-fa fa-trash",
          tooltip: "Delete",
          handler: "onDeleteRecord",
        },
      ],
    },
  ],
  bbar: {
    xtype: "pagingtoolbar",
    displayInfo: true,
  },

  listeners: {
    rowdblclick: "onItemSelected",
  },

  viewConfig: {
    getRowClass: function (record, index, rowParams, store) {
      if (record.get("block") === true) {
        //#ff4000
        return 'block-record';
      }

      else if (record.get("activated") === false) {
        //#e6fffe
        return 'inactive-record';
      }
    },
  },
});
