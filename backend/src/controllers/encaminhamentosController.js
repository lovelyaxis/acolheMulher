const prisma = require("../config/prisma");

const STATUS = ["PENDENTE", "CONCLUIDO"];
const CAMPOS_PROIBIDOS = ["nome", "nomeCompleto", "cpf", "telefone"];
// O id do encaminhamento é o UUID gerado pelo banco (VarChar(36)).
const FORMATO_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

// Valida o :id da rota. Retorna o id ou null (resposta já enviada).
function validarId(req, res) {
  const id = typeof req.params.id === "string" ? req.params.id.trim() : "";
  if (!FORMATO_ID.test(id)) {
    res.status(400).json({ erro: "Identificador do encaminhamento inválido." });
    return null;
  }
  return id;
}

// Validação compartilhada entre cadastrar e editar.
// Retorna os dados normalizados ou null (resposta já enviada).
function validarDados(corpo, res) {
  // Impedir dados pessoais da pessoa atendida (RN002).
  const possuiDadosPessoais = CAMPOS_PROIBIDOS.some(campo =>
    Object.prototype.hasOwnProperty.call(corpo, campo)
  );
  if (possuiDadosPessoais) {
    res.status(400).json({ erro: "Não é permitido informar dados pessoais." });
    return null;
  }

  const codigoCaso = limpar(corpo.codigoCaso);
  if (codigoCaso.length < 3 || codigoCaso.length > 50) {
    res.status(400).json({ erro: "Informe um código de caso válido." });
    return null;
  }

  const tipoAtendimento = limpar(corpo.tipoAtendimento);
  if (!tipoAtendimento || tipoAtendimento.length > 100) {
    res.status(400).json({ erro: "Informe um tipo de atendimento válido." });
    return null;
  }

  const unidadeDestinoId =
    typeof corpo.unidadeDestinoId === "string"
      ? corpo.unidadeDestinoId.trim()
      : "";
  if (!unidadeDestinoId) {
    res.status(400).json({ erro: "Informe a unidade de destino." });
    return null;
  }

  let observacoes = null;
  if (corpo.observacoes !== undefined && corpo.observacoes !== null) {
    if (typeof corpo.observacoes !== "string") {
      res.status(400).json({ erro: "Observações inválidas." });
      return null;
    }
    if (corpo.observacoes.length > 1000) {
      res.status(400).json({
        erro: "As observações devem ter no máximo 1000 caracteres."
      });
      return null;
    }
    observacoes = corpo.observacoes.trim() || null;
  }

  return { codigoCaso, tipoAtendimento, unidadeDestinoId, observacoes };
}

// POST /api/encaminhamentos
async function cadastrar(req, res) {
  const dados = validarDados(req.body || {}, res);
  if (dados === null) return;

  try {
    const unidade = await prisma.unidade.findUnique({
      where: { id: dados.unidadeDestinoId },
      select: { id: true, ativa: true }
    });

    if (!unidade || !unidade.ativa) {
      return res.status(400).json({
        erro: "A unidade de destino não existe ou está inativa."
      });
    }

    const criado = await prisma.encaminhamento.create({
      data: {
        codigoCaso: dados.codigoCaso,
        tipoAtendimento: dados.tipoAtendimento,
        unidadeDestinoId: unidade.id,
        observacoes: dados.observacoes,
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

// Busca o registro e aplica a regra de acesso:
// administradores veem tudo, profissionais só o que registraram.
async function buscarPermitido(id, req) {
  const registro = await prisma.encaminhamento.findUnique({
    where: { id },
    select: CAMPOS
  });
  if (!registro) return null;
  if (!ehAdmin(req) && registro.profissionalId !== req.usuario.id) return null;
  return registro;
}

// GET /api/encaminhamentos/:id
async function buscar(req, res) {
  const id = validarId(req, res);
  if (id === null) return;

  try {
    const registro = await buscarPermitido(id, req);
    if (!registro) {
      return res.status(404).json({ erro: "Encaminhamento não encontrado." });
    }
    return res.status(200).json(registro);
  } catch (erro) {
    return erroInterno(res, "buscar", erro);
  }
}

// PUT /api/encaminhamentos/:id
async function editar(req, res) {
  const id = validarId(req, res);
  if (id === null) return;

  const dados = validarDados(req.body || {}, res);
  if (dados === null) return;

  try {
    const registro = await buscarPermitido(id, req);
    if (!registro) {
      return res.status(404).json({ erro: "Encaminhamento não encontrado." });
    }

    const unidade = await prisma.unidade.findUnique({
      where: { id: dados.unidadeDestinoId },
      select: { id: true, ativa: true }
    });

    if (!unidade || !unidade.ativa) {
      return res.status(400).json({
        erro: "A unidade de destino não existe ou está inativa."
      });
    }

    // Somente os dados do caso são editáveis: status segue no
    // PATCH /:id/status e o profissional responsável não muda.
    const atualizado = await prisma.encaminhamento.update({
      where: { id: registro.id },
      data: {
        codigoCaso: dados.codigoCaso,
        tipoAtendimento: dados.tipoAtendimento,
        unidadeDestinoId: unidade.id,
        observacoes: dados.observacoes
      },
      select: CAMPOS
    });

    return res.status(200).json(atualizado);
  } catch (erro) {
    if (erro.code === "P2002") {
      return res.status(409).json({
        erro: "Já existe um encaminhamento com este código de caso."
      });
    }
    return erroInterno(res, "editar", erro);
  }
}

// PATCH /api/encaminhamentos/:id/status  (corpo: { "status": "CONCLUIDO" })
async function atualizarStatus(req, res) {
  const id = validarId(req, res);
  if (id === null) return;

  const { status } = req.body || {};
  if (!STATUS.includes(status)) {
    return res.status(400).json({
      erro: `Status inválido. Use: ${STATUS.join(", ")}.`
    });
  }

  try {
    const registro = await buscarPermitido(id, req);
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

module.exports = { cadastrar, listar, buscar, editar, atualizarStatus };
