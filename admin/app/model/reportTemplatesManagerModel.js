Ext.define("Admin.model.reportTemplatesManagerModel", {
  extend: "Admin.model.Base",
  alias: "reportTemplatesManagerModel",
  fields: [
    "id",
    "report_name_for_user",
    "report_name_in_system",
    "code",
    "images",
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
      read: `${globalThis.Admin.GlobalVariables.remoteUrl}/jasperService/getReportTemplates`
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
