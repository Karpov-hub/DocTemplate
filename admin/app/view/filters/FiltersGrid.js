Ext.define("Admin.view.filters.FiltersGrid", {
  extend: "Ext.form.Panel",
  xtype: "filtersGrid",
  items: [
    {
      xtype: "tabpanel",
      items: [
        {
          title: "Categories",
          items: Ext.create("Admin.view.filters.CategoriesGrid", {
            scope: this,
            model: "Admin.model.CategoriesModel"
          }),
        },
        {
          title: "Groups",
          items: Ext.create("Admin.view.filters.GroupsGrid", {
            scope: this,
            model: "Admin.model.GroupsModel"
          })
        },
        {
          title: "Life Situations",
          items: Ext.create("Admin.view.filters.LifeSituationsGrid", {
            scope: this,
            model: "Admin.model.LifeSituationsModel"
          })
        },
      ],
    }
  ],
});

