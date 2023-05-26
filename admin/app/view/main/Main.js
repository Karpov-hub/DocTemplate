/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define("Admin.view.main.Main", {
  extend: "Ext.tab.Panel",
  xtype: "app-main",

  requires: [
    "Ext.plugin.Viewport",
    "Ext.window.MessageBox",
    "Admin.view.main.MainController",

    "Admin.view.main.MainModel",
    "Admin.view.main.reportTemplatesManagerGrid",
    "Admin.History",
    "Admin.menu"
  ],
  requires: [
    "Admin.view.login.LoginForm",
    "Admin.view.main.reportTemplatesManagerGrid",
    "Admin.view.roles.RolesGrid",
    "Admin.view.users.UsersGrid",
    "Admin.view.innerDocuments.InnerDocumentsGrid",
  ],
  viewModel: "main",
  plugins: "viewport",

  ui: "navigation",
  controller: "MainController",
  tabBarHeaderPosition: 1,
  titleRotation: 0,
  tabRotation: 0,
  header: {
    layout: {
      align: "stretchmax"
    },
    title: {
      flex: 0
    },
    iconCls: "fa-th-list"
  },

  platformConfig: {
    desktop: {
      header: {
        layout: {
          align: "stretchmax"
        },
        title: {
          text: "Jasper report manager",
          flex: 0
        },
        iconCls: "fa-th-list"
      }
    }
  },

  tabBar: {
    flex: 1,
    scrollable: {
      x: true,
      y: true
    },
    layout: {
      align: "stretch",
      overflowHandler: "none"
    }
  },
  dockedItems: [
    {
      xtype: "toolbar",
      style: {
        background: "#f6f6f6"
      },
      dock: "top",
      items: [
        "->",
        {
          fieldCls: "biggerText",
          xtype: "displayfield",
          name: "user_name"
        },
        "-",
        {
          xtype: "button",
          handler: "logout",
          text: "Logout",
          iconCls: "fa fa-sign-out-alt"
        }
      ]
    }
  ],

  responsiveConfig: {
    tall: {
      headerPosition: "top"
    },
    wide: {
      headerPosition: "left"
    }
  },

  defaults: {
    bodyPadding: 10,
    tabConfig: {
      responsiveConfig: {
        wide: {
          iconAlign: "left",
          textAlign: "left"
        },
        tall: {
          iconAlign: "top",
          textAlign: "center"
          // width: 120
        }
      }
    }
  },

  listeners: {
    async afterrender(el, cmp) {
      let menu_items = await this.controller.getUserData();
      this.add(menu_items);
      await this.controller.restoreHistory();
    },
    tabchange: "onTabChange"
  }
});
