Ext.define("Admin.view.filters.FiltersForm", {
  extend: "Admin.view.main.BaseForm",

  xtype: "filterform",
  width: 1000,
  height: 700,
  requires: ["Admin.view.filters.FiltersFormController"],
  controller: "FiltersFormController",
  items: [
    {
      xtype: "form",
      layout: "anchor",
      defaults: {
        anchor: "100%",
        xtype: "textfield",
        allowBlank: false,
        labelWidth: 130
      },
      items: [
        {
          allowBlank: true,
          name: "id",
          hidden: true
        },
        {
          allowBlank: true,
          name: "filter_table",
          hidden: true
        },
        {
          name: "name_ru",
          fieldLabel: "Name RU",
        },
        {
          name: "name_en",
          fieldLabel: "Name EN",
        },
        {
          name: "description_ru",
          fieldLabel: "Description RU",
          xtype: "textareafield",
          height: 200,
        },
        {
          name: "description_en",
          fieldLabel: "Description EN",
          xtype: "textareafield",
          height: 200,
        },
      ]
    }
  ],
  buttons: [
    { text: "Save", action: "save" },
    { text: "Close", action: "close" }
  ]
});
