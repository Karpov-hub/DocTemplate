exports.baseApiUrl = "http://localhost";
exports.frontendUrl = "http://localhost:8080";
exports.baseApiPort = 6544;
exports.testMode = false;

exports.swaggerPort = 9898;

exports.fileProviderType = "yandexDisk";
exports.minio = {
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin"
};

exports.transporter = {
  host: "email-smtp.eu-central-1.amazonaws.com",
  port: 465,
  secure: true,
  auth: {
    user: "AKIAXOJZKKR56Y2C7PAG",
    pass: "BAcEcOFhnVeXph+4iNUZwPnfAv4VN8Elm4ehiIkQqjcG"
  }
};
exports.mail_from = '"Jasper report" <dev-03@payit.lt>';
exports.token_lifetime = 3600;

exports.mailer = {
  baseURL: "https://ms.enovate-it.com/",
  user: "jrtdoctemplate@gmail.com",
  pass: "vgcdrqhtdjztsqse",
  USERNAME: "fIjqgDI9kxSrgjiw",
  PASSWORD: "vjgW3bWUjCByR76F"
};
exports.mail_from = '"Jasper report" <dev-03@payit.lt>';
exports.token_lifetime = 3600;

exports.reCaptchaV3 = {
  url: "https://www.google.com/recaptcha/api/siteverify",
  secret: process.env.RECAPTCHAV3_SECRET
};
