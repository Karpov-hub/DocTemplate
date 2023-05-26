Ext.define("Admin.model.InnerDocumentsModel", {
  extend: "Admin.model.Base",
  fields: [
    "id",
    "template",
    "type",
    "ctime",
    "mtime",
    "data_example"
  ],

  proxy: {
    type: "rest",
    params: {},
    actionMethods: {
      read: "POST"
    },
    noCache: true,
    api: {
      read: `${globalThis.Admin.GlobalVariables.remoteUrl}/document/getInnerDocuments`
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
