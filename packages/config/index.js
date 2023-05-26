const Path = require("path");
require("dotenv").config({ path: Path.join(__dirname, "../../.env") });

process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const config = require("config");

Object.keys(config).forEach((k) => {
  exports[k] = config[k];
});
