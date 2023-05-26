Ext.define("Admin.view.login.LoginController", {
  extend: "Admin.view.main.BaseController",

  alias: "controller.LoginController",

  control: {
    "[action=login]": {
      click: "doSignin"
    },
    "[name=login]":{
      specialkey:"keyPressed"
    },
    "[name=password]":{
      specialkey:"keyPressed"
    }
  },

  async keyPressed(el,e) {
    if (e.getKey() == e.ENTER) {
      await this.doSignin();
    }
  },
  async doSignin() {
    let data = this.view.down("form").getForm().getValues();
    let result = await this.callApi("auth/signin", data);
    if (result.token) {
      localStorage.setItem("auth_token", result.token);
      this.getView().destroy();
      return Ext.widget("app-main");
    } else Ext.toast("Authorisation Error");
  }
});
