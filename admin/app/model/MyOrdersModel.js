Ext.define("Admin.model.MyOrdersModel", {
  extend: "Admin.model.Base",
  fields: [
    "id",
    "first_name",
    "last_name",
    "middle_name",

    "template_name",
    "ctime",
    "status",
    "requirements",
    "attached_files",
  ],

  proxy: {
    type: "rest",
    params: {},
    extraParams: { token: localStorage.getItem("auth_token") },
    actionMethods: {
      read: "POST",
    },
    noCache: true,
    api: {
      read: `${globalThis.Admin.GlobalVariables.remoteUrl}/order/get-order`,
    },
    writer: {
      type: "json",
    },
    reader: {
      type: "json",
      rootProperty: "rows",
      totalProperty: "count",
    },
    paramAsJson: true,
  },
});