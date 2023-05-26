Ext.define("Admin.view.filters.CategoriesGrid", {
  extend: "Admin.view.main.BaseGrid",
  requires: [
    "Admin.store.CategoriesStore",
    "Admin.view.filters.FiltersForm",
    "Admin.view.filters.FiltersGridController"
  ],

  store: {
    type: "categories"
  },

  controller: "FiltersGridController",

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
    },
  ],

  bbar: {
    xtype: "pagingtoolbar",
    displayInfo: true
  },

  dockedItems: [
    {
      xtype: 'pagingtoolbar',
      store: {
        type: "categories"
      },
      dock: 'bottom',
      displayInfo: true,
    }
  ],

  columns: [
    {
      dataIndex: "id",
      hidden: true
    },
    {
      dataIndex: "name_ru",
      text: "Name RU",
      width: 200,
      sortable: true,
      filter: true,
      renderer(v, m, r) {
        return `${r.data.name.name_ru || ""
          }`;
      },
    },
    {
      dataIndex: "name_en",
      text: "Name EN",
      width: 250,
      sortable: true,
      filter: true,
      renderer(v, m, r) {
        return `${r.data.name.name_en || ""
          }`;
      },
    },
    {
      dataIndex: "description_ru",
      text: "Description RU",
      flex: 1,
      sortable: false,
      filter: false,
      renderer(v, m, r) {
        return `${r.data.description.description_ru || ""
          }`;
      },
    },
    {
      dataIndex: "description_en",
      text: "Description EN",
      flex: 1,
      sortable: false,
      filter: false,
      renderer(v, m, r) {
        return `${r.data.description.description_en || ""
          }`;
      },
    },
    {
      xtype: "actioncolumn",
      width: 50,
      align: "center",
      items: [
        {
          iconCls: "x-fa fa-trash",
          tooltip: "Delete",
          handler: "onDeleteRecord"
        }
      ]
    }
  ],

  listeners: {
    rowdblclick: "onItemSelected"
  },
});
