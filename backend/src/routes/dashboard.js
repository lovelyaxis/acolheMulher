const express = require("express");
const controller = require("../controllers/dashboardController");
const { autenticar, autorizar } = require("../middlewares/auth");

const router = express.Router();

router.get(
  "/profissional",
  autenticar,
  autorizar("PROFISSIONAL"),
  controller.profissional
);

router.get(
  "/admin",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controller.admin
);

module.exports = router;