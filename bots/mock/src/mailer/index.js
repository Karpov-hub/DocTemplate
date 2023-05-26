import { Router } from "express";
const router = Router();

router.post("/api/auth/template/send-mail", (req, res) => {
  return res.send({ success: true });
});

export default router;
