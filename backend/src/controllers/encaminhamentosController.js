const prisma = require("../config/prisma");

const STATUS = ["PENDENTE", "CONCLUIDO"];
const CAMPOS_PROIBIDOS = ["nome", "nomeCompleto", "cpf", "telefone"];

const CAMPOS = {
  id: true,
  codigoCaso: true,
  tipoAtendimento: true,
  unidadeDestinoId: true,
  observacoes: true,
  status: true,
  profissionalId: true,
  criadoEm: true,
  atualizadoEm: true,
  unidadeDestino: { select: { id: true, nome: true, tipo: true } },
  profissional: { select: { id: true, nome: true } }
};

function limpar(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function ehAdmin(req) {
  return req.usuario.perfil === "ADMINISTRADOR";
}

function erroInterno(res, contexto, erro) {
  console.error(`Erro em encaminhamentos (${contexto}):`, erro.message);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}

// POST /api/encaminhamentos
async function cadastrar(req, res) {
  const corpo = req.body || {};

  // Impedir dados pessoais da pessoa atendida (RN002).
  const possuiDadosPessoais = CAMPOS_PROIBIDOS.some(campo =>
    Object.prototype.hasOwnProperty.call(corpo, campo)
  );
  if (possuiDadosPessoais) {
    return res.status(400).json({
      erro: "Não é permitido informar dados pessoais."
    });
  }

  const codigoCaso = limpar(corpo.codigoCaso);
  if (codigoCaso.length < 3 || codigoCaso.length > 50) {
    return res.status(400).json({ erro: "Informe um código de caso válido." });
  }

  const tipoAtendimento = limpar(corpo.tipoAtendimento);
  if (!tipoAtendimento || tipoAtendimento.length > 100) {
    return res.status(400).json({
      erro: "Informe um tipo de atendimento válido."
    });
  }

  let observacoes = null;
  if (corpo.observacoes !== undefined && corpo.observacoes !== null) {
    if (typeof corpo.observacoes !== "string") {
      return res.status(400).json({ erro: "Observações inválidas." });
    }
    if (corpo.observacoes.length > 1000) {
      return res.status(400).json({
        erro: "As observações devem ter no máximo 1000 caracteres."
      });
    }
    observacoes = corpo.observacoes.trim() || null;
  }

  try {
    const unidade =
      typeof corpo.unidadeDestinoId === "string"
        ? await prisma.unidade.findUnique({
            where: { id: corpo.unidadeDestinoId },
            select: { id: true, ativa: true }
          })
        : null;

    if (!unidade || !unidade.ativa) {
      return res.status(400).json({
        erro: "A unidade de destino não existe ou está inativa."
      });
    }

    const criado = await prisma.encaminhamento.create({
      data: {
        codigoCaso,
        tipoAtendimento,
        unidadeDestinoId: unidade.id,
        observacoes,
        status: "PENDENTE",
        // O profissional vem do token, nunca do corpo da requisição.
        profissionalId: req.usuario.id,
        criadoEm: new Date()
      },
      select: CAMPOS
    });

    return res.status(201).json({
      mensagem: "Encaminhamento registrado com sucesso.",
      encaminhamento: criado
    });
  } catch (erro) {
    if (erro.code === "P2002") {
      return res.status(409).json({
        erro: "Já existe um encaminhamento com este código de caso."
      });
    }
    return erroInterno(res, "cadastrar", erro);
  }
}

// GET /api/encaminhamentos
async function listar(req, res) {
  try {
    const where = ehAdmin(req) ? {} : { profissionalId: req.usuario.id };

    if (typeof req.query.status === "string" && STATUS.includes(req.query.status)) {
      where.status = req.query.status;
    }

    const lista = await prisma.encaminhamento.findMany({
      where,
      select: CAMPOS,
      orderBy: { criadoEm: "desc" }
    });

    return res.status(200).json(lista);
  } catch (erro) {
    return erroInterno(res, "listar", erro);
  }
}

async function buscarPermitido(req) {
  const registro = await prisma.encaminhamento.findUnique({
    where: { id: req.params.id },
    select: CAMPOS
  });
  if (!registro) return null;
  if (!ehAdmin(req) && registro.profissionalId !== req.usuario.id) return null;
  return registro;
}

// GET /api/encaminhamentos/:id
async function buscar(req, res) {
  try {
    const registro = await buscarPermitido(req);
    if (!registro) {
      return res.status(404).json({ erro: "Encaminhamento não encontrado." });
    }
    return res.status(200).json(registro);
  } catch (erro) {
    return erroInterno(res, "buscar", erro);
  }
}

// PATCH /api/encaminhamentos/:id/status  (corpo: { "status": "CONCLUIDO" })
async function atualizarStatus(req, res) {
  const { status } = req.body || {};
  if (!STATUS.includes(status)) {
    return res.status(400).json({
      erro: `Status inválido. Use: ${STATUS.join(", ")}.`
    });
  }

  try {
    const registro = await buscarPermitido(req);
    if (!registro) {
      return res.status(404).json({ erro: "Encaminhamento não encontrado." });
    }

    // Só o status muda: observações e histórico são preservados.
    const atualizado = await prisma.encaminhamento.update({
      where: { id: registro.id },
      data: { status },
      select: CAMPOS
    });

    return res.status(200).json(atualizado);
  } catch (erro) {
    return erroInterno(res, "atualizarStatus", erro);
  }
}

module.exports = { cadastrar, listar, buscar, atualizarStatus };