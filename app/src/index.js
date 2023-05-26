const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("@app/config");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(cors());

const jasperServiceRouter = require("./router/jasperService.router.js");
const authRouter = require("./router/auth.router.js");
const userRouter = require("./router/user.router.js");
const documentRouter = require("./router/document.router.js");
const settingsRouter = require("./router/settings.router.js");
const clientRouter = require("./router/client.router.js");
const orderRouter = require("./router/order.router.js");
const categoryRouter = require("./router/category.router.js");

app.use("/jasperService", jasperServiceRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/document", documentRouter);
app.use("/settings", settingsRouter);
app.use("/client", clientRouter);
app.use("/order", orderRouter);
app.use("/category", categoryRouter);

app.use("/", (req, res) => {
  return res.send({ message: "404" });
});

const port = config.baseApiPort || 6544;
const host = config.baseApiUrl || "http://localhost";
app.listen(port, () => {
  console.log(`Server is listening on ${host}:${port}`);
});

module.exports = app;
