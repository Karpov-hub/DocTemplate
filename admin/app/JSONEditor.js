Ext.define("Admin.JSONEditor", {
  extend: "Ext.form.field.Base",
  alias: "widget.jsoneditor",

  labelAlign: "top",
  flex: 1,
  border: false,

  value: null,
  editor: null,
  readOnly: false,
  name: null,

  listeners: {
    afterrender: function () {
      this.jsonEditorReady();
    },
    resize: function (win, width, height) {
      this.container.setHeight(height);
    }
  },
  fieldSubTpl: [
    '<div id="{id}" style="height: 100%;width: 100%;overflow: auto"></div>',
    { disableFormats: true }
  ],
  initComponent: function () {
    this.callParent(arguments);
  },
  jsonEditorReady: function () {
    /**
         * Available modes :
         * 'tree' : - Edit, add, move, remove, and duplicate fields and values.
         *          - Change type of values.
         *          - Sort arrays and objects.
         *          - Colorized code.
         *          - Search & highlight text in the treeview.
         *          - Undo and redo all actions.
         * 'code' : - Format and compact JSON.
         *          - Colorized code (powered by Ace).
         *          - Inspect JSON (powered by Ace).
         * 'view' : Readonly
         * 'form' : Readonly
         * 'text' : Format and compact JSON
         *
         ### Usage :
         * options : {
         *              mode: 'tree',
         *              // allowed modes, this will create combobox.      
         *              modes: ['code', 'form', 'text', 'tree', 'view']
         *           }
         */
    this.options = this.options || { mode: this.readOnly ? "view" : "tree" };

    this.editor = new JSONEditor(this.container, this.options, this.value);
  },
  getValue: function () {
    return this.editor ? this.editor.getText() : null;
  },
  setValue: function (value) {
    if (this.editor) return this.editor.setText(value);
  },
  setReadOnly: function (readOnly) {
    if (Ext.isDefined(childNodes) && childNodes.length > 0) {
      if (Ext.get(childNodes[0].id)) {
        Ext.get(childNodes[0].id).destroy();
      }
      this.editor.setMode(readOnly ? "view" : "tree");
    }
  }
});
