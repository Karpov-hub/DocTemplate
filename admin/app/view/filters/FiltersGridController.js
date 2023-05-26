Ext.define("Admin.view.filters.FiltersGridController", {
  extend: "Admin.view.main.BaseController",
  alias: "controller.FiltersGridController",

  init: function () {
    this.getView().getStore().pageSize = 25;
  },

  onItemSelected(grid, record, element) {
    let recordData = {
      id: record.data.id,
      name_ru: record.data.name.name_ru,
      name_en: record.data.name.name_en,
      description_ru: record.data.description.description_ru,
      description_en: record.data.description.description_en,
      filter_table: this.getNameGrid(grid)
    }
    let window = this.openWindow("Admin.view.filters.FiltersForm", {
      scope: this,
      recordData: recordData
    });
    window.down("form").getForm().setValues(recordData);
  },

  add() {
    let recordData = {
      filter_table: this.getNameGrid(this.getView())
    }
    let window = this.openWindow("Admin.view.filters.FiltersForm", {
      scope: this,
      recordData: recordData
    });
    window.down("form").getForm().setValues(recordData);
  },

  async onDeleteRecord(grid, rowIndex, colIndex) {
    let filterTable = this.getNameGrid(grid)
    let category = grid.getStore().getAt(rowIndex).get("name").category;

    await Ext.Msg.show({
      title: "Deleting",
      message:
        "Are you sure that you want to delete category '" + category + "' ?",
      buttons: Ext.Msg.YESNO,
      icon: Ext.Msg.QUESTION,
      fn: (btn) => {
        if (btn === "yes") {
          this.callApi("category/delete-category", {
            id: grid.getStore().getAt(rowIndex).get("id"),
            filterTable: String(filterTable),
          });
          this.view.getStore().removeAt(rowIndex);
          Ext.toast("Category '" + category + "' was deleted");
        }
      },
    });
  },

  getNameGrid: function (grid) {
    const filterTables = [
      "categories",
      "life_situations",
      "groups",
    ]
    return filterTables.indexOf(grid.getStore().config.type)
  },
});
