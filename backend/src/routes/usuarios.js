const express = require("express");
const controller = require("../controllers/usuariosController");
const { autenticar, autorizar } = require("../middlewares/auth");

const router = express.Router();

// Todas as rotas exigem login e perfil de administrador.
router.use(autenticar, autorizar("ADMINISTRADOR"));

router.get("/", controller.listar);
router.get("/:id", controller.buscar);
router.post("/", controller.cadastrar);
router.put("/:id", controller.editar);
router.patch("/:id/status", controller.alterarStatus);
router.delete("/:id", controller.excluir);

module.exports = router;