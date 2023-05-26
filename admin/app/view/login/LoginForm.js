Ext.define("Admin.view.login.LoginForm", {
  extend: "Ext.window.Window",
  xtype: "login-form",

  requires: [
    'Admin.view.login.LoginController',
    "Ext.form.Panel",
    'Ext.window.Toast'
  ],
    
  controller:'LoginController',
  width:330,
  title: "Login Window",
  bodyPadding: 10,
  frame:true,
  draggable:false,
  resizable:false,
  closable:false,
  autoShow: true,
  
  items: [
    {
      xtype: "form",
      reference: "form",
      defaults: {
        xtype: "textfield",
        allowBlank: false,
        anchor:'100%'
      },
      items: [
        {
          name: "login",
          title: "Login"
        },
        {
          name: "password",
          title: "Password",
          inputType: "password"
        }
      ],
      buttons: [
        {
          text: "Login",
          action:'login',
          formBind: true
        }
      ],
      listeners:{
        
      }
    }
  ]
});
