Ext.define("Admin.menu", {
  items: [
    {
      title: "Report manager",
      iconCls: "fa-book",
      items: [
        {
          xtype: "reportManager",
        },
      ],
    },
    {
      title: "Documents template manager",
      iconCls: "fa-file",
      items: [
        {
          xtype: "innerDocumentsTemplateManager",
        },
      ],
    },
    {
      title: "Roles",
      iconCls: "fa-users-cog",
      items: [
        {
          xtype: "rolesGrid",
        },
      ],
    },
    {
      title: "Users",
      iconCls: "fa-users",
      items: [
        {
          xtype: "usersGrid",
        },
      ],
    },
    {
      title: "Filters",
      iconCls: "fa-search",
      items: [
        {
          xtype: "filtersGrid",
        },
      ],
    },
    {
      title: "Clients",
      iconCls: "fa-users",
      items: [
        {
          xtype: "clientsGrid",
        },
      ],
    },
    {
      title: "My Orders",
      iconCls: "fa-bookmark",
      items: [
        {
          xtype: "myOrdersGrid",
        },
      ],
    },
    {
      title: "Orders",
      iconCls: "fa-clipboard",
      items: [
        {
          xtype: "unassignedOrdersGrid",
        },
      ],
    },
  ],
});
