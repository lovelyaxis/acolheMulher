const express = require("express");
const controller = require("../controllers/ocorrenciasController");
const { autenticar, autorizar } = require("../middlewares/auth");

const router = express.Router();

// Todas as rotas exigem login de profissional ou administrador.
router.use(autenticar, autorizar("PROFISSIONAL", "ADMINISTRADOR"));

router.get("/", controller.listarOcorrencias);
router.post("/", controller.criarOcorrencia);

module.exports = router;
