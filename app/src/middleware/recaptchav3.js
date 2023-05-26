import axios from "axios";
import config from "@app/config";

async function captcha(req, res, next) {
  if (!req || !req.body || !req.body.captcha)
    res.send({
      code: "CAPTCHA_MISSING",
      message: "Missing token for captcha"
    });
  const captchaRes = await _verify(req.body.captcha);
  if (
    !captchaRes ||
    !captchaRes.data ||
    !captchaRes.data.success ||
    !captchaRes.data.success === true
  ) {
    if (captchaRes) {
      if (captchaRes.data) console.warn("Captcha not passed", captchaRes.data);
      if (captchaRes.error) console.error("Captcha error", captchaRes.error);
    } else console.error("No response from ReCaptcha");
    res.send({
      code: "CAPTCHA_FAILED",
      message: "Sorry, captcha check is not passed"
    });
  } else next();
}

async function _verify(token) {
  return await axios({
    method: "POST",
    url: config.reCaptchaV3.url,
    params: {
      secret: config.reCaptchaV3.secret,
      response: token
    }
  });
}

module.exports = {
  captcha
};
