Ext.define("Admin.model.RolesModel", {
  extend: "Admin.model.Base",

  fields: [
    "id",
    "modules",
    "name",
    "ctime",
    "mtime"
  ],
  proxy: {
    type: "rest",
    params: {},
    actionMethods: {
      read: "POST"
    },
    noCache: true,
    api: {
      read: `${globalThis.Admin.GlobalVariables.remoteUrl}/user/getPermissions`
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
