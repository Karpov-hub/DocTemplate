Ext.define("Admin.view.myOrders.NoteForm", {
  extend: "Admin.view.main.BaseForm",
  title: "Note",
  width: 800,
  height: 450,
  requires: ["Admin.view.myOrders.NoteFormController"],
  controller: "NoteFormController",
  items: [
    {
      xtype: "form",
      layout: "anchor",
      items: [
        {
          xtype: "label",
          name: "title",
        },
        {
          xtype: "textareafield",
          anchor: "100%",
          height: 270,
          name: "note",
        },
      ]
    }
  ],
  buttons: [
    { text: "Continue", action: "continue" },
    { text: "Cancel", action: "cancel" }
  ],
});
