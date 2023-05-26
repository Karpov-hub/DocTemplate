Ext.define("Admin.model.ClientsModel", {
  extend: "Admin.model.Base",
  fields: [
    "id",
    "first_name",
    "last_name",
    "middle_name",
    "phone",
    "email",
    "ctime",
    "activated",
    "block",
  ],

  proxy: {
    type: "rest",
    params: {},
    actionMethods: {
      read: "POST",
    },
    noCache: true,
    api: {
      read: `${globalThis.Admin.GlobalVariables.remoteUrl}/client/profile/get-clients`,
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
