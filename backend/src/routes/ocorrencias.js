const express = require("express");
const { criarOcorrencia, listarOcorrencias } = require("../controllers/ocorrenciasController");
const { autenticar, autorizar } = require("../middlewares/auth");

const router = express.Router();

router.post("/", autenticar, autorizar("ADMINISTRADOR"), criarOcorrencia);
router.get("/", autenticar, autorizar("ADMINISTRADOR"), listarOcorrencias);

module.exports = router;
