Ext.define("Admin.model.GroupsModel", {
  extend: "Admin.model.Base",

  fields: [
    "id",
    "name",
    "description",
  ],
  proxy: {
    type: "rest",
    params: {},
    extraParams: { filterTable: 2 },
    actionMethods: {
      read: "POST"
    },
    noCache: true,
    api: {
      read: `${globalThis.Admin.GlobalVariables.remoteUrl}/category/get-categories`
    },
    writer: {
      type: "json"
    },
    reader: {
      type: "json",
      rootProperty: "rows",
      totalProperty: "count"
    },
    paramAsJson: true
  }
});
