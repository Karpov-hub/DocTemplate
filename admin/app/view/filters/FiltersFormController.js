Ext.define("Admin.view.filters.FiltersFormController", {
  extend: "Admin.view.main.BaseController",
  alias: "controller.FiltersFormController",

  init: function () {
    this.getView().setTitle(this.view.scope.view.getStore().config.type);
  },
  control: {
    "[action=close]": {
      click: "closeform"
    },
    "[action=save]": {
      click: "save"
    },
  },

  closeform: function () {
    this.view.close();
  },

  save: async function () {
    if (!this.view.down("form").getForm().isValid())
      return Ext.toast("Validation error");

    let data = this.view.down("form").getForm().getValues();
    data = {
      id: data.id,
      name: {
        name_en: data.name_en,
        name_ru: data.name_ru,
      },
      description: {
        description_en: data.description_en,
        description_ru: data.description_ru,
      },
      filterTable: String(data.filter_table),
    }
    let result;
    if (!data.id) {
      result = await this.callApi("category/create-category", data)
    }
    else {
      result = await this.callApi("category/update-category", data);
    }

    if (result.code == "SUCCESS") {
      this.view.scope.view.getStore().reload();
      return this.view.close();
    }
    return Ext.toast("Saving error");
  },
});
