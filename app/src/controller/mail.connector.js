const config = require("@app/config");
const axios = require("axios");
const api = axios.create({
  baseURL: config.mailer.baseURL
});

async function sendMessage(data) {
  try {
    const res = await api.post(
      "/api/auth/template/send-mail",
      {
        nonce: data.nonce,
        from: config.mailer.user,
        destination: {
          to: [data.email],
          cc: null,
          bcc: null
        },
        template: {
          templateId: data.template.templateId,
          subject: data.template.subject,
          data: data.template.data
        },
        callbackUrl: ""
      },
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              config.mailer.USERNAME + ":" + config.mailer.PASSWORD
            ).toString("base64")
        }
      }
    );
    return res.data;
  } catch (error) {
    return console.error("Failed to send email", error);
  }
}

module.exports = {
  sendMessage
};
