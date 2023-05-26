/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define("Admin.Application", {
  extend: "Ext.app.Application",

  name: "Admin",

  quickTips: false,
  platformConfig: {
    desktop: {
      quickTips: true
    }
  },
  requires: [
    // This will automatically load all classes in the Admin namespace
    // so that application classes do not need to require each other.
    "Admin.*",
    "Admin.GlobalVariables",
    "Admin.view.login.LoginForm",
    "Admin.view.main.Main"
  ],
  launch: function () {
    Ext.widget(localStorage.getItem("auth_token") ? "app-main" : "login-form");
    this.callParent(arguments);
  },
  onAppUpdate: function () {
    Ext.Msg.confirm(
      "Application Update",
      "This application has an update, reload?",
      function (choice) {
        if (choice === "yes") {
          window.location.reload();
        }
      }
    );
  }
});
