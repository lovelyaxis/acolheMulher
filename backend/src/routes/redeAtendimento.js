const express = require("express");
const controller = require("../controllers/unidadesController");
const { autenticar, autorizar } = require("../middlewares/auth");

const router = express.Router();

const admin = autorizar("ADMINISTRADOR");

// Todas as rotas exigem autenticação (qualquer perfil).
router.use(autenticar);

// Listar e detalhar a rede de atendimento: qualquer perfil autenticado.
// O controller já filtra: profissionais veem só unidades ativas,
// administradores veem todas.
router.get("/", controller.listarInternas);
router.get("/:id", controller.buscar);

// Criar, editar e inativar: somente administradores.
// A remoção é lógica (ativa=false), nunca um DELETE físico.
router.post("/", admin, controller.cadastrar);
router.put("/:id", admin, controller.editar);
router.patch("/:id/inativar", admin, controller.inativar);

module.exports = router;
