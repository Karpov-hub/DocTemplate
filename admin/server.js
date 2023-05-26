var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/Admin/index.html");
});

// THIS IS WHAT YOU NEED
app.use(express.static(__dirname + "/Admin/"));

// OR THE LONG WAY
app.get("/app.json", function (req, res) {
  var options = {
    root: __dirname + "/Admin/",
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  res.set("Content-Type", "application/json");
  res.sendFile("app.json", options);
});
app.get("/.js", function (req, res) {
  var options = {
    root: __dirname + "/Admin/",
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  res.set("Content-Type", "text/javascript");
  res.sendFile("app.js", options);
});
var server = app.listen(1842, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
