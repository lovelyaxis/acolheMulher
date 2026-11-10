const express = require("express");
const controller = require("../controllers/unidadesController");
const { autenticar, autorizar } = require("../middlewares/auth");

const router = express.Router();

const equipe = autorizar("PROFISSIONAL", "ADMINISTRADOR");
const admin = autorizar("ADMINISTRADOR");

// Pública (sem login)
router.get("/", controller.listarPublicas);

// IMPORTANTE: "/internas" precisa vir antes de "/:id".
router.get("/internas", autenticar, equipe, controller.listarInternas);
router.get("/:id", autenticar, equipe, controller.buscar);

// Somente administrador
router.post("/", autenticar, admin, controller.cadastrar);
router.put("/:id", autenticar, admin, controller.editar);
router.patch("/:id/inativar", autenticar, admin, controller.inativar);
router.delete("/:id", autenticar, admin, controller.excluir);

module.exports = router;