Ext.define("Admin.model.UnassignedOrdersModel", {
  extend: "Admin.model.Base",
  fields: [
    "first_name",
    "last_name",
    "middle_name",

    "id",
    "template_name",
    "requirements",
    "attached_files",
    "ctime",
  ],

  proxy: {
    type: "rest",
    params: {},
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
