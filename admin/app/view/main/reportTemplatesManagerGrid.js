Ext.define("Admin.view.main.reportTemplatesManagerGrid", {
  extend: "Admin.view.main.BaseGrid",
  xtype: "reportManager",
  hash: "reportTemplatesManagerGrid",

  requires: [
    "Admin.store.reportTemplatesManagerStore",
    "Admin.view.main.reportTemplatesManagerForm"
  ],

  title: "Jasper Report Templates Manager",

  store: {
    type: "reportTemplatesManager"
  },
  requires: ["Admin.view.main.reportTemplatesManagerGridController"],
  controller: "reportTemplatesManagerGrid",

  plugins: {
    gridfilters: true
  },

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
      text: "Rep id",
      flex: 1,
      sortable: true,
      filter: true,
      hidden: true
    },
    {
      dataIndex: "report_name_for_user",
      text: "Report name",
      flex: 1,
      sortable: true,
      filter: true
    },
    {
      dataIndex: "report_name_in_system",
      text: "System report name",
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
      dataIndex: "code",
      hidden: true
    },
    {
      xtype: "actioncolumn",
      width: 50,
      items: [
        {
          iconCls: "x-fa fa-trash",
          tooltip: "Delete",
          handler: "onDeleteRecord"
        },
        {
          iconCls: "x-fa fa-cloud-download-alt",
          tooltip: "Download template",
          handler: "downloadTemplate"
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
