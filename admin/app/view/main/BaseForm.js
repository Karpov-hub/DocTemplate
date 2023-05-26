Ext.define("Admin.view.main.BaseForm", {
  extend: "Ext.window.Window",
  padding: 10,
  closeAction: "close",
  modal: true,
  requires: [
    "Ext.window.Toast",
    "Ext.layout.container.Border",
    "Ext.form.FieldContainer",
    "Ext.form.CheckboxGroup",
    "Ext.form.ComboBox",
    "Ext.layout.container.Column",
    "Ext.grid.ColumnComponentLayout"
  ],

  init: function (view) {
    this.view = view;
  },
  syncSize: function () {
    let width = this.width ? this.width : Ext.Element.getViewportWidth(),
      height = this.height ? this.height : Ext.Element.getViewportHeight();
    this.setSize(Math.floor(width * 0.9), Math.floor(height * 0.9));
    this.setXY([Math.floor(width * 0.05), Math.floor(height * 0.05)]);
  },
  afterRender: function () {
    this.callParent(arguments);
    this.syncSize();
  }
});
