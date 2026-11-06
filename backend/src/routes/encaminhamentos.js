const express = require("express");
const controller = require("../controllers/encaminhamentosController");
const { autenticar, autorizar } = require("../middlewares/auth");

const router = express.Router();

// Todas as rotas exigem login de profissional ou administrador.
router.use(autenticar, autorizar("PROFISSIONAL", "ADMINISTRADOR"));

// Somente profissionais registram encaminhamentos.
router.post("/", autorizar("PROFISSIONAL"), controller.cadastrar);
router.get("/", controller.listar);
router.get("/:id", controller.buscar);
router.patch("/:id/status", controller.atualizarStatus);

module.exports = router;