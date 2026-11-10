const express = require("express");
const controller = require("../controllers/orientacoesController");

const router = express.Router();

// Rota pública: não exige login, de propósito.
router.post("/", controller.receber);

module.exports = router;