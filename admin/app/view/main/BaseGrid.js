Ext.define("Admin.view.main.BaseGrid", {
  extend: "Ext.grid.Panel",
  scrollable: true,
  height: Ext.Element.getViewportHeight() * 0.94,
  requires: ["Ext.grid.filters.Filters", "Ext.grid.plugin.CellEditing"]
});
