const prisma = require("../config/prisma");

async function criarOcorrencia(req, res) {
  try {
    const { tipoEvento, observacoes } = req.body || {};

    if (!tipoEvento || tipoEvento.trim() === "") {
      return res.status(400).json({ erro: "Tipo de evento é obrigatório." });
    }

    const profissionalId = req.usuario ? req.usuario.id : null;

    const ocorrencia = await prisma.ocorrencia.create({
      data: {
        tipoEvento: tipoEvento.trim(),
        observacoes: observacoes ? observacoes.trim() : null,
        profissionalId,
      },
      select: {
        id: true,
        tipoEvento: true,
        observacoes: true,
        criadoEm: true,
        profissional: {
          select: { id: true, nome: true, email: true },
        },
      },
    });

    return res.status(201).json({
      mensagem: "Ocorrência registrada com sucesso.",
      ocorrencia,
    });
  } catch (erro) {
    console.error("Erro ao registrar ocorrência:", erro.message);
    return res.status(500).json({ erro: "Erro interno ao registrar ocorrência." });
  }
}

async function listarOcorrencias(req, res) {
  try {
    const ocorrencias = await prisma.ocorrencia.findMany({
      select: {
        id: true,
        tipoEvento: true,
        observacoes: true,
        criadoEm: true,
        profissional: {
          select: { id: true, nome: true, email: true },
        },
      },
      orderBy: { criadoEm: "desc" },
    });

    return res.status(200).json({ ocorrencias });
  } catch (erro) {
    console.error("Erro ao listar ocorrências:", erro.message);
    return res.status(500).json({ erro: "Erro interno ao listar ocorrências." });
  }
}

module.exports = { criarOcorrencia, listarOcorrencias };
