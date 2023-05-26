Ext.define("Admin.view.main.BaseController", {
  extend: "Ext.app.ViewController",

  init() {
    if (this.view.store) this.view.store.reload();
  },

  async showPanelAsScreen(xclass, cfg = {}) {
    Ext.History.setViewConfig(cfg)
    Ext.History.add(xclass)
  },
  async callApi(url, data, opts) {
    return new Promise((resolve, reject) => {
      let request_object = {
        url: `${globalThis.Admin.GlobalVariables.remoteUrl}/${url}`,
        method: "POST",
        jsonData: data,
        success(form, msg) {
          resolve(Ext.decode(form.responseText));
        },
        failure(res) {
          console.error("Removing error");
        }
      }
      if (opts && opts.headers) request_object.headers = opts.headers
      Ext.Ajax.request(request_object);
    });
  },
  openWindow(xclass, { scope, recordData }) {
    let window = Ext.create({
      xclass,
      scope,
      recordData
    });
    window.show();
    return window;
  },
  async refresh() {
    this.view.getStore().reload();
  },
  download(code) {
    let link = document.createElement("a");
    link.setAttribute(
      "href",
      `${globalThis.Admin.GlobalVariables.remoteUrl}/jasperService/download?${code}`
    );
    link.click();
  },
  downloadBase64File(name, file, ext) {
    let link = document.createElement("a");
    link.setAttribute("href", `data:application/octet-stream;base64,${file}`);
    link.download = `${name}.${ext}`;
    link.click();
  },
  submitForm(scope, api_url) {
    return new Promise((resolve, reject) => {
      let me = scope;
      if (!scope.view.down("form").getForm().isValid()) {
        Ext.toast("Validation error");
        resolve();
      }
      scope.view
        .down("form")
        .getForm()
        .submit({
          url: `${globalThis.Admin.GlobalVariables.remoteUrl}${api_url}`,
          waitMsg: "Please wait...",
          method: "POST",
          success() {
            resolve();
          },
          failure() {
            resolve();
          }
        });
    });
  }
});
