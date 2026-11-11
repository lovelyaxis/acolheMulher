const express = require("express");
const { login, me, logout } = require("../controllers/authController");
const { autenticar } = require("../middlewares/auth");

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", autenticar, me);

module.exports = router;