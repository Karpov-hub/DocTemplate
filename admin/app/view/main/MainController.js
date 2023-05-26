Ext.define("Admin.view.main.MainController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.MainController",
  init() {
    Ext.History.init();
  },
  async getUserData() {
    let menu = Ext.create("Admin.menu");
    let userData = await this.callApi("auth/getUserData", {
      token: localStorage.getItem("auth_token")
    });
    if (userData.code) {
      this.view.destroy();
      Ext.widget("login-form");
    }
    this.refreshToken();
    if (!userData || !userData.hasOwnProperty("user_data")) return [];
    this.view
      .down("[name=user_name]")
      .setValue(userData.user_data.name || userData.user_data.login);
    if (userData.hasOwnProperty("user_data") && userData.su) {
      return menu.items;
    }
    if (!userData.hasOwnProperty("permissions")) return [];
    let items = [];
    globalThis.Admin.GlobalVariables.setUser(userData.user_data);
    for (let module of menu.items) {
      if (
        userData.permissions.find((el) => {
          return el.xtype == module.items[0].xtype;
        })
      )
        items.push(module);
    }

    return items;
  },

  async refreshToken() {
    setTimeout(async () => {
      await this.callApi("auth/refreshToken", {
        token: localStorage.getItem("auth_token")
      });
      this.refreshToken();
    }, 3600000);
  },

  async logout() {
    let res = await this.callApi("auth/logout", {
      token: localStorage.getItem("auth_token")
    });
    if (res.success) localStorage.removeItem("auth_token");
    this.getView().destroy();
    Admin.app.redirectTo("");
    return Ext.widget("login-form");
  },

  async restoreHistory() {
    if (Ext.History.hash) {
      await this.changeHistory(Ext.History.hash);
    } else this.view.setActiveTab(0);
    Ext.History.on("change", async (token, cfg) => {
      if (token) await this.changeHistory(token, cfg);
    });
  },

  async changeHistory(token, cfg) {
    if (this.view && this.view.items) {
      let items = null
      if (this && this.view && this.view.items && this.view.items.items && this.view.items.items.length)
        items = this.view.items.items.map((el) => {
          return el.config.items ? el.config.items[0].xtype : false;
        });
      if (items) {
        let tab_index = items.indexOf(Ext.History.hash)
        if (cfg) {
          let screen = Ext.create(token, cfg)
          this.view.add(Object.assign(screen, { hidden: true }))
          this.view.setActiveTab(screen)
          return
        } else
          if (token.split('.')[0] == 'Admin') return Ext.History.back()

        this.view.setActiveTab(tab_index);
        this.view.items.items[tab_index].items.items[0].controller.init()
      }
    }
  },

  async onTabChange(tabpanel, tab) {
    if (tab && tab.config && tab.config.items)
      Ext.History.add(tab.config.items[0].xtype);
  }
});
