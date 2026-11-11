const express = require("express");
const controller = require("../controllers/encaminhamentosController");
const { autenticar, autorizar } = require("../middlewares/auth");

const router = express.Router();

// Todas as rotas exigem login de profissional ou administrador.
router.use(autenticar, autorizar("PROFISSIONAL", "ADMINISTRADOR"));

// Listar e detalhar: profissionais e administradores.
router.get("/", controller.listar);
router.get("/:id", controller.buscar);

// Criar, editar e inativar (status): somente profissionais.
router.post("/", autorizar("PROFISSIONAL"), controller.cadastrar);
router.put("/:id", autorizar("PROFISSIONAL"), controller.editar);
router.patch("/:id/status", autorizar("PROFISSIONAL"), controller.atualizarStatus);

module.exports = router;
