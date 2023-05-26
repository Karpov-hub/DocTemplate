Ext.define("Admin.view.users.UsersGrid", {
  extend: "Admin.view.main.BaseGrid",
  xtype: "usersGrid",

  requires: ["Admin.store.UsersStore", "Admin.view.roles.UsersForm"],

  title: "Users",

  store: {
    type: "users"
  },
  requires: ["Admin.view.users.UsersGridController"],

  controller: "UsersGridController",
  rolesStore: Ext.create("Admin.store.RolesStore"),
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
      hidden: true
    },
    {
      dataIndex: "name",
      text: "User name",
      flex: 1,
      sortable: true,
      filter: true
    },
    {
      dataIndex: "login",
      text: "Login",
      flex: 1,
      sortable: true,
      filter: true
    },
    {
      dataIndex: "role",
      text: "Role",
      flex: 1,
      sortable: true,
      renderer(v, m, r) {
        let role = this.rolesStore.data.items.find((el) => {
          return v == el.id;
        });
        return role ? role.data.name : "";
      }
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
      dataIndex: "block",
      text: "Blocked",
      flex: 1,
      sortable: true,
      filter: true,
      renderer(v, m, r) {
        return v ? "YES" : "NO";
      }
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
  bbar: {
    xtype: "pagingtoolbar",
    displayInfo: true
  },

  listeners: {
    rowdblclick: "onItemSelected"
  }
});
