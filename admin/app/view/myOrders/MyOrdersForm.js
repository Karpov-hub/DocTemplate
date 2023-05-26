Ext.define("Admin.view.myOrders.MyOrdersForm", {
  extend: "Ext.form.Panel",
  xtype: "myordersform",
  closeAction: "close",
  requires: ["Admin.view.myOrders.MyOrdersFormController"],
  controller: "MyOrdersFormController",
  tbar: [
    {
      iconCls: "x-fa fa-angle-left",
      tooltip: "Return",
      action: "return",
      width: 50,
    },
    {
      xtype: "combo",
      displayField: "label",
      valueField: "type",
      name: "status",
      allowBlank: false,
      editable: false,
      store: {
        fields: ["status"],
        data: [
          { label: "To do", type: "0" },
          { label: "In progress", type: "1" },
          { label: "Done", type: "2" },
          { label: "Need to clarify", type: "3" },
          { label: "Rejected", type: "4" },
        ]
      }
    },
  ],

  items: [
    {
      border: true,
      xtype: "tabpanel",
      layout: "anchor",
      items: [
        {
          title: "Template config",
          xtype: "form",
          layout: "border",
          height: Math.floor(Ext.Element.getViewportHeight() * 0.8),
          items: [
            {
              title: "Customer data",
              xtype: "panel",
              layout: "anchor",
              region: "west",
              collapsible: true,
              margin: { right: 10 },
              defaults: {
                xtype: "textareafield",
                anchor: "100%",
                labelWidth: 100,
                width: 500,
                margin: 10
              },
              items: [
                {
                  name: "full_name",
                  fieldLabel: "Full name",
                  readOnly: true,
                },
                {
                  name: "template_name",
                  fieldLabel: "Template name",
                  readOnly: true,
                },
                {
                  name: "requirements",
                  fieldLabel: "Requirements",
                  readOnly: true,
                  height: 200
                },
                {
                  title: "Attached Files",
                  xtype: "panel",
                  name: "attached_files",
                  height: 180,
                  border: true,
                  scrollable: {
                    y: 'scroll',
                  },
                },
              ],
              bbar: [
                {
                  text: "Generate",
                  iconCls: "x-fa fa-plus",
                  scale: "large",
                  handler: "generate",
                },
              ],
            },
            {
              title: "Data example",
              xtype: "panel",
              layout: "fit",
              region: "center",
              items: [
                {
                  xtype: "panel",
                  layut: "anchor",
                  items: [
                    {
                      options: {
                        mode: "code",
                        enableSort: false,
                        enableTransform: false
                      },
                      margin: 0,
                      xtype: "jsoneditor",
                      allowBlank: "false",
                      name: "json_editor"
                    },
                    {
                      xtype: "textfield",
                      hidden: true,
                      name: "data_example"
                    }
                  ]
                }
              ]
            }
          ]
        },
      ]
    }
  ],
});
