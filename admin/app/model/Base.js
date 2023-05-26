Ext.define("Admin.model.Base", {
  extend: "Ext.data.Model",

  requires: ["Ext.data.identifier.Uuid"],

  identifier: "uuid",

  schema: {
    namespace: "Admin.model"
  }
});
