import express from "express";
import bodyParser from "body-parser";
import reCaptchaV3 from "./reCaptchaV3";
import mailer from "./mailer";

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/captcha", reCaptchaV3);
app.use("/mailer", mailer);

const server = app.listen(8010, () => {
  console.log("Test callback receiver is running at %s", server.address().port);
});
