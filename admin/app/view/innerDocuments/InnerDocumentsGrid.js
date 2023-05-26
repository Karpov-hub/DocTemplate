Ext.define("Admin.view.innerDocuments.InnerDocumentsGrid", {
  extend: "Admin.view.main.BaseGrid",
  xtype: "innerDocumentsTemplateManager",

  requires: [
    "Admin.store.InnerDocumentsStore",
    "Admin.view.innerDocuments.InnerDocumentsForm"
  ],

  title: "Inner documents manager",

  store: {
    type: "inner_documents"
  },

  controller: "InnerDocumentsGridController",

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
      dataIndex: "template",
      flex: 1,
      hidden: true
    },
    {
      dataIndex: "report_name_for_user",
      text: "Template name",
      flex: 1,
      sortable: true,
      filter: true,
      renderer(v, m, r) {
        return r.data.jasper_report_template.report_name_for_user;
      }
    },
    {
      dataIndex: "report_name_in_system",
      text: "System name",
      flex: 1,
      sortable: true,
      filter: true,
      renderer(v, m, r) {
        return r.data.jasper_report_template.report_name_in_system;
      }
    },
    {
      dataIndex: "code",
      hidden: true,
      renderer(v, m, r) {
        return r.data.jasper_report_template.code;
      }
    },
    {
      dataIndex: "type",
      text: "Type",
      width: 60,
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
    },
    {
      dataIndex: "code",
      flex: 1,
      hidden: true
    },
    {
      dataIndex: "data_example",
      flex: 1,
      hidden: true
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
