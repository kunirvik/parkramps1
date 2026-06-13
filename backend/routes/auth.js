const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require ("bcryptjs");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  if (login !== process.env.ADMIN_LOGIN) {
    return res.status(401).json({ error: "Invalid login" });
  }

  const ok = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH
  );

  if (!ok) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign(
    { role: "admin", login },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: { login, role: "admin" }
  });
});
module.exports = router;