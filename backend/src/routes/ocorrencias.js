const express = require("express");
const { criarOcorrencia, listarOcorrencias } = require("../controllers/ocorrenciasController");
const { autenticar } = require("../middlewares/auth");

const router = express.Router();

router.post("/", autenticar, criarOcorrencia);
router.get("/", autenticar, listarOcorrencias);

module.exports = router;
