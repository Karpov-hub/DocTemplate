const db = require("@app/db");
const crypto = require("crypto");
const config = require("@app/config");
const redis = require("@app/redis");
const { sendMessage } = require("./mail.connector");

async function signup(req, res) {
  let existClient = await db.client.findOne({
    where: { email: req.body.email.toLowerCase() }
  });
  if (existClient != null) {
    return res.send({
      code: "EMAILALREADYREGISTERED",
      message: "Sorry, you can't sign up with this email id"
    });
  }
  let newClient = await db.client.create({
    email: req.body.email.toLowerCase(),
    password: crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("base64"),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    middle_name: req.body.middle_name,
    phone: req.body.phone,
    type: req.path === "/auth/signup_personal" ? "personal" : "business",
    company_name: req.body.company_name,
    company_director_fullname: req.body.company_director_fullname,

    ctime: Date.now(),
    mtime: Date.now(),
    activated: false,
    block: false
  });

  let activation_token = crypto.randomBytes(30).toString("hex");

  const testMode =
    config.testMode && new RegExp(/^.+@ethereal.email$/).test(req.body.email);

  if (testMode) activation_token = req.body.email;

  await redis.set(
    `activate:${activation_token}:${newClient.email}`,
    newClient.id
  );
  /*шлём на введённый пользователем 
  мейл с ссылкой на активацию аккаунта, вид ссылки:
https://<URL фронтенда>/profile-activation?activation_token=<a_token> */
  const link = new URL("profile-activation", config.frontendUrl);
  link.searchParams.append("activation_token", activation_token);

  let data = {
    nonce: "1211",
    email: req.body.email,
    template: {
      templateId: "3a93ddf0-c7a8-47a0-abbe-07b274d3aa58",
      subject: "Confirm your email",
      data: {
        link: link
      }
    }
  };
  if (!testMode) sendMessage(data);
  return res.send({
    code: "SUCCESS",
    message:
      "Successful registration. Please, check your inbox for the activation link."
  });
}

async function activateProfile(req, res) {
  let token = req.body.activation_token;
  const keys = await redis.keys(`activate:${token}:*`);
  if (!keys || !keys.length) {
    return res.send({
      code: "ACTIVATIONERROR",
      message: "Profile activation error"
    });
  }
  const email = keys[0].split(":")[2];
  if (!email) {
    return res.send({
      code: "ACTIVATIONERROR",
      message: "Profile activation error"
    });
  }
  await db.client.update(
    { activated: true },
    {
      where: {
        email
      }
    }
  );
  await redis.del(`activate:${token}:${email}`);
  return res.send({
    code: "SUCCESS",
    message: "Profile successfully activated"
  });
}

function genRestorePasswordKey(email) {
  return `restore-password:${email}`;
}

async function passwordRestore(req, res) {
  // #swagger.description = 'After this request, the user will receive on his email the link to the actual frontend, like: https://https://doctemplate-api.tadbox.com/reset_password_confirm?token=tokenstring&email=user@email.com. You need to grab the email query parameters and use it in the /client/auth/password-restore-submit request'

  const client = await db.client.findOne({
    where: { email: req.body.email.toLowerCase() }
  });

  if (!client)
    return res.send({
      code: "ERROR",
      message:
        "Sorry, you can't restore your password. Please, refer to the support."
    });
  if (client.activated == false)
    return res.send({
      code: "CLIENTNOTACTIVATED",
      message:
        "Sorry, your profile is not activated yet. Please, check your inbox or refer to support."
    });

  let token = crypto.randomBytes(30).toString("hex");
  const testMode =
    config.testMode && new RegExp(/^.+@ethereal.email$/i).test(req.body.email);

  if (testMode) token = client.email.toLowerCase();

  const redisKey = genRestorePasswordKey(client.email.toLowerCase());
  await redis.set(redisKey, token);

  const link = new URL("reset_password_confirm", config.frontendUrl);
  link.searchParams.append("token", token);
  link.searchParams.append("email", client.email);

  const emailData = {
    nonce: "1211",
    email: req.body.email,
    template: {
      templateId: "b199021f-92ec-4994-af63-8dc1f805b9f2",
      subject: "Restore your password",
      data: {
        link
      }
    }
  };

  sendMessage(emailData);

  return res.send({
    code: "SUCCESS",
    message: "Please, check your inbox for the password reset link"
  });
}

async function passwordRestoreSubmit(req, res) {
  // #swagger.description = perform this request after grabbing the query parameters from the email link

  const client = await db.client.findOne({
    where: { email: req.body.email.toLowerCase() }
  });

  if (!client)
    return res.send({
      code: "ERROR",
      message:
        "Sorry, you can't restore your password. Please, refer to the support."
    });

  const redisKey = genRestorePasswordKey(client.email);
  const stored = await redis.get(redisKey);
  if (!stored || stored !== req.body.token)
    return res.send({
      code: "WRONGTOKEN",
      message:
        "Failed to authorize. Probably your reset link is outdated - try to request a new password reset email again"
    });

  client.password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("base64");

  await client.save();

  await redis.del(redisKey);

  return res.send({
    code: "SUCCESS",
    message: "Your password is successfully updated"
  });
}

async function signin(req, res) {
  let client = await db.client.findOne({
    where: { email: req.body.email.toLowerCase() },
    attributes: ["id", "email", "password", "activated", "block"]
  });
  if (!client) {
    return res.send({ code: "AUTHFAILED", message: "Failed to authorize" });
  }
  if (client.activated == false) {
    return res.send({
      code: "CLIENTNOTACTIVATED",
      message:
        "Sorry, your profile is not activated yet. Please, check your inbox or refer to support."
    });
  }
  if (client.block == true) {
    return res.send({ code: "CLIENTBLOCKED", message: "Client blocked" });
  }
  if (
    crypto.createHash("sha256").update(req.body.password).digest("base64") !=
    client.password
  ) {
    return res.send({ code: "AUTHFAILED", message: "Failed to authorize" });
  }
  // let otpAndToken = await sendAuthOtp(client.id, client.email);
  // return res.send({ otp_token: otpAndToken.otp_token });
  let session_token = crypto.randomBytes(30).toString("hex");
  await redis.set("usr" + session_token, client.id);
  return res.send({
    code: "SUCCESS",
    session_token: session_token
  });
}

async function sendAuthOtp(id, email) {
  let otp_token = crypto.randomBytes(30).toString("hex");
  let otp = generateOtp(6);
  await redis.set("otp" + otp_token, JSON.stringify({ otp: otp, id: id }));
  let data = {
    nonce: "1212",
    email: email,
    template: {
      templateId: "7ec0a77d-6ec9-47ca-914b-bdc4b1525a35",
      subject: "Confirmation code for access DocTemplates",
      data: {
        OTP: otp
      }
    }
  };
  sendMessage(data);
  return { otp_token, otp };
}

function generateOtp(length) {
  let result = "";
  let characters = "0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function resendOtp(req, res) {
  let otp_token = req.body.otp_token;
  let otpNclient = JSON.parse(await redis.get("otp" + otp_token));
  let clientEmail = await db.client.findOne({
    where: { id: otpNclient.id },
    attributes: ["email"]
  });
  let data = {
    nonce: "1212",
    email: clientEmail.email,
    template: {
      templateId: "7ec0a77d-6ec9-47ca-914b-bdc4b1525a35",
      subject: "Confirmation code for access DocTemplates",
      data: {
        OTP: otpNclient.otp
      }
    }
  };
  sendMessage(data);
  return res.send({ otp_token: otp_token });
}

async function checkOtp(req, res) {
  let otp_token = req.body.otp_token;
  const otpString = "otp" + otp_token;
  const stored = await redis.get(otpString);
  if (!stored) res.send({ code: "OTPFAILED", message: "Failed to authorize" });
  let otpNclient = JSON.parse(stored);
  if (req.body.otp != otpNclient.otp) {
    return res.send({ code: "OTPFAILED", message: "Failed to authorize" });
  }
  let session_token = crypto.randomBytes(30).toString("hex");
  await redis.set("usr" + session_token, otpNclient.id);
  await redis.del(otpString);
  return res.send({
    code: "SUCCESS",
    message: "Correct otp",
    session_token: session_token
  });
}

async function getClients(req, res) {
  const searchingOptions = {
    attributes: [
      "id",
      "first_name",
      "last_name",
      "middle_name",
      "phone",
      "email",
      "ctime",
      "activated",
      "block"
    ]
  };
  let id = req.body.id;
  if (id != null) {
    const client = await db.client.findOne({
      where: { id: req.body.id },
      attributes: searchingOptions.attributes
    });
    return res.send({ client: client });
  }
  searchingOptions.offset = req.body.start;
  searchingOptions.limit = req.body.limit;
  let div = "DESC";
  if (req.body.div != null) {
    div = req.body.div;
  }
  if (req.body.field != null) {
    searchingOptions.order = [[req.body.field, div]];
  }
  /*
  if (filter.name != null)
    searchingOptions.where = { name: { [Op.like]: `%${filter.name}%` } };
  if (filter.email != null)
    searchingOptions.where = { email: { [Op.like]: `%${filter.email}%` } };
  */
  const { count, rows } = await db.client.findAndCountAll(searchingOptions);
  return res.send({ code: "SUCCESS", count, rows });
}

async function updateBlockingClient(req, res) {
  let clientblock = await db.client.findOne({
    where: { id: req.body.id },
    attributes: ["block"]
  });
  await db.client.update(
    { block: !clientblock.block },
    {
      where: { id: req.body.id }
    }
  );
  return res.send({ code: "SUCCESS" });
}

async function updateClient(req, res) {
  let client_id = await redis.get("usr" + req.body.session_token);
  if (!client_id)
    return res.send({
      code: "SESSIONEXPIRED"
    });
  let updatingOptions = { ...req.body };
  updatingOptions.mtime = Date.now();
  await db.client.update(updatingOptions, {
    where: {
      id: client_id
    }
  });
  return res.send({
    code: "SUCCESS",
    message: "Client data was sucessfuly changed"
  });
}

async function updateClientPassword(req, res) {
  let id = await redis.get("usr" + req.body.session_token);
  await db.client.update(
    {
      password: crypto
        .createHash("sha256")
        .update(req.body.password)
        .digest("base64")
    },
    {
      where: {
        id: id
      }
    }
  );
  return res.send({
    code: "SUCCESS",
    message: "Password was sucessfuly changed"
  });
}

async function deleteClient(req, res) {
  await db.client.destroy({
    where: { id: req.body.id }
  });
  return res.send({ code: "SUCCESS", message: "Client was deleted" });
}

async function cleanTest(req, res) {
  if (!config.testMode) return res.status(403).end();

  await db.client.destroy({
    where: { email: req.body.email }
  });

  return res.send({ code: "SUCCESS" });
}

module.exports = {
  signup,
  activateProfile,
  passwordRestore,
  passwordRestoreSubmit,
  signin,
  resendOtp,
  checkOtp,
  getClients,
  updateBlockingClient,
  updateClient,
  updateClientPassword,
  deleteClient,
  cleanTest
};
