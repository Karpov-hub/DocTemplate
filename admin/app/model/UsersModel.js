Ext.define("Admin.model.UsersModel", {
  extend: "Admin.model.Base",

  fields: [
    "id",
    "role",
    "name",
    "login",
    "ctime",
    "mtime",
    "block"
  ],
  proxy: {
    type: "rest",
    params: {},
    actionMethods: {
      read: "POST"
    },
    noCache: true,
    api: {
      read: `${globalThis.Admin.GlobalVariables.remoteUrl}/user/getUsers`
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
