Ext.define("Admin.History", {
    override: "Ext.util.History",

    VARIABLE: "HERE",
    setViewConfig: function (config) {
        this.view_config = config
        return true
    },
    clearViewConfig: function () {
        this.view_config = null
        return true
    },
    handleStateChange: function (token) {
        // browser won't have # here but may have !
        token = token.replace(this.hashRe, '');

        this.fireEvent('change', this.currentToken = token, this.view_config);
    }

})