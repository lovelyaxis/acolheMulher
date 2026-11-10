const express = require("express");
const { login, me } = require("../controllers/authController");
const { autenticar } = require("../middlewares/auth");

const router = express.Router();

router.post("/login", login);
router.get("/me", autenticar, me);

module.exports = router;