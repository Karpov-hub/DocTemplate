Ext.define("Admin.view.roles.RolesGrid", {
  extend: "Admin.view.main.BaseGrid",
  xtype: "rolesGrid",

  requires: [
    "Admin.store.RolesStore",
    "Admin.view.roles.RolesGridController",
    "Admin.view.roles.RolesForm"
  ],

  title: "Roles",

  store: {
    type: "roles"
  },

  controller: "RolesGridController",

  tbar: [
    {
      text: "Add",
      tooltip: "Add new record",
      iconCls: "x-fa fa-plus",
      scale: "medium",
      handler: "add"
    },
    {
      text: "Refresh",
      iconCls: "x-fa fa-redo",
      scale: "medium",
      handler: "refresh"
    }
  ],
  columns: [
    {
      dataIndex: "id",
      flex: 1,
      hidden: true
    },
    {
      dataIndex: "name",
      text: "Role name",
      flex: 1,
      sortable: true,
      filter: true
    },
    {
      xtype: "datecolumn",
      text: "Creation time",
      flex: 1,
      sortable: true,
      format: "d.m.Y H:i:s",
      filter: {
        xtype: "datefield",
        format: "d.m.Y"
      },
      dataIndex: "ctime"
    },
    {
      dataIndex: "modules",
      hidden: true
    },
    {
      xtype: "actioncolumn",
      width: 25,
      items: [
        {
          iconCls: "x-fa fa-trash",
          tooltip: "Delete",
          handler: "onDeleteRecord"
        }
      ]
    }
  ],
  bbar: {
    xtype: "pagingtoolbar",
    displayInfo: true
  },

  listeners: {
    rowdblclick: "onItemSelected"
  }
});
