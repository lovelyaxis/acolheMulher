const prisma = require("../config/prisma");

const CATEGORIAS = ["direitos", "violencia", "atendimento", "outros"];

// POST /api/orientacoes-anonimas
async function receber(req, res) {
  const corpo = req.body || {};
  const { mensagem, categoria } = corpo;

  if (typeof mensagem !== "string" || mensagem.trim() === "") {
    return res.status(400).json({ erro: "A mensagem é obrigatória." });
  }

  if (mensagem.trim().length > 2000) {
    return res.status(400).json({
      erro: "A mensagem deve ter no máximo 2000 caracteres."
    });
  }

  if (typeof categoria !== "string" || !CATEGORIAS.includes(categoria)) {
    return res.status(400).json({ erro: "Informe uma categoria válida." });
  }

  try {
    // Guardar somente a mensagem e a categoria.
    // Campos extras enviados pelo cliente são ignorados.
    await prisma.orientacaoAnonima.create({
      data: {
        mensagem: mensagem.trim(),
        categoria,
        criadoEm: new Date()
      }
    });

    return res.status(201).json({
      mensagem: "Orientação recebida com sucesso."
    });
  } catch (erro) {
    // Registrar só o código do erro: o texto do erro pode conter a mensagem.
    console.error(
      "Erro ao registrar orientação anônima (código:",
      erro.code || "desconhecido",
      ")"
    );
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
}

module.exports = { receber };