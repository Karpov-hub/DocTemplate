import { Router } from "express";
const router = Router();

const used_tokens = [];

router.post("/", (req, res) => {
  const token = req.query.response;
  if (token === "wrong_token") {
    res.send({
      success: false,
      "error-codes": ["invalid-input-response"]
    });
  } else {
    if (used_tokens.includes(token)) {
      res.send({
        success: false,
        "error-codes": ["timeout-or-duplicate"]
      });
    } else {
      used_tokens.push(token);
      res.send({
        success: true,
        challenge_ts: new Date(),
        hostname: "localhost",
        score: 0.9,
        action: "submit"
      });
    }
  }
});

export default router;
