const prisma = require("../config/prisma");
const { normalizarTexto } = require("../utils/normalizar");

const TIPOS = [
  "DELEGACIA_MULHER",
  "CRAS_CREAS",
  "CASA_ACOLHIMENTO",
  "DEFENSORIA_PUBLICA",
  "HOSPITAL_REFERENCIA"
];

// Consulta pública: nunca mostra vagas.
const CAMPOS_PUBLICOS = {
  id: true,
  nome: true,
  tipo: true,
  endereco: true,
  bairro: true,
  cep: true,
  telefone: true,
  horario: true
};

// Consulta interna: inclui vagas e situação.
const CAMPOS_INTERNOS = {
  ...CAMPOS_PUBLICOS,
  ativa: true,
  vagasTotal: true,
  vagasDisponiveis: true,
  criadoEm: true,
  atualizadoEm: true
};

function limpar(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function inteiro(valor) {
  if (typeof valor === "number" && Number.isInteger(valor)) return valor;
  if (typeof valor === "string" && /^\d+$/.test(valor.trim())) {
    return Number(valor.trim());
  }
  return null;
}

function filtros(query) {
  const where = {};

  if (typeof query.tipo === "string" && TIPOS.includes(query.tipo)) {
    where.tipo = query.tipo;
  }

  if (typeof query.busca === "string" && query.busca.trim() !== "") {
    const busca = query.busca.trim();
    where.OR = [
      { nome: { contains: busca } },
      { bairro: { contains: busca } },
      { cep: { contains: busca } }
    ];
  }

  return where;
}

function validarCorpo(corpo) {
  const nome = limpar(corpo.nome);
  const tipo = limpar(corpo.tipo);
  const endereco = limpar(corpo.endereco);
  const bairro = limpar(corpo.bairro);
  const cepNumeros = limpar(corpo.cep).replace(/\D/g, "");
  const telefone = limpar(corpo.telefone);
  const horario = limpar(corpo.horario);

  if (!nome || nome.length > 150) {
    return { erro: "Informe o nome da unidade (até 150 caracteres)." };
  }
  if (!TIPOS.includes(tipo)) {
    return { erro: `Tipo de unidade inválido. Use: ${TIPOS.join(", ")}.` };
  }
  if (!endereco || endereco.length > 200) {
    return { erro: "Informe o endereço (até 200 caracteres)." };
  }
  if (!bairro || bairro.length > 100) {
    return { erro: "Informe o bairro (até 100 caracteres)." };
  }
  if (cepNumeros.length !== 8) {
    return { erro: "Informe um CEP válido com 8 dígitos." };
  }
  if (telefone.length > 20) {
    return { erro: "O telefone deve ter no máximo 20 caracteres." };
  }
  if (horario.length > 100) {
    return { erro: "O horário deve ter no máximo 100 caracteres." };
  }

  let vagasTotal = null;
  let vagasDisponiveis = null;

  if (tipo === "CASA_ACOLHIMENTO") {
    vagasTotal = inteiro(corpo.vagasTotal);
    vagasDisponiveis = inteiro(corpo.vagasDisponiveis);

    if (vagasTotal === null || vagasDisponiveis === null) {
      return {
        erro:
          "Casas de acolhimento precisam informar vagas total e disponíveis (números inteiros, 0 ou mais)."
      };
    }
    if (vagasDisponiveis > vagasTotal) {
      return {
        erro: "As vagas disponíveis não podem ser maiores que o total."
      };
    }
  }

  return {
    dados: {
      nome,
      tipo,
      endereco,
      bairro,
      cep: `${cepNumeros.slice(0, 5)}-${cepNumeros.slice(5)}`,
      telefone: telefone || null,
      horario: horario || null,
      vagasTotal,
      vagasDisponiveis
    }
  };
}

async function buscarDuplicada(nome, endereco) {
  return prisma.unidade.findUnique({
    where: {
      unidade_duplicidade_unique: {
        nomeNormalizado: normalizarTexto(nome),
        enderecoNormalizado: normalizarTexto(endereco)
      }
    },
    select: { id: true }
  });
}

// O id da unidade é o UUID gerado pelo banco (VarChar(36)).
const FORMATO_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Valida o :id da rota. Retorna o id ou null (resposta já enviada).
function validarId(req, res) {
  const id = typeof req.params.id === "string" ? req.params.id.trim() : "";
  if (!FORMATO_ID.test(id)) {
    res.status(400).json({ erro: "Identificador da unidade inválido." });
    return null;
  }
  return id;
}

function erroInterno(res, contexto, erro) {
  console.error(`Erro em unidades (${contexto}):`, erro.message);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}

// GET /api/unidades
async function listarPublicas(req, res) {
  try {
    const unidades = await prisma.unidade.findMany({
      where: { ativa: true, ...filtros(req.query) },
      select: CAMPOS_PUBLICOS,
      orderBy: { nome: "asc" }
    });
    return res.status(200).json(unidades);
  } catch (erro) {
    return erroInterno(res, "listarPublicas", erro);
  }
}

// GET /api/unidades/internas
async function listarInternas(req, res) {
  try {
    const where = filtros(req.query);

    // Profissional vê só unidades ativas; administrador vê todas.
    if (req.usuario.perfil !== "ADMINISTRADOR") {
      where.ativa = true;
    }

    const unidades = await prisma.unidade.findMany({
      where,
      select: CAMPOS_INTERNOS,
      orderBy: { nome: "asc" }
    });
    return res.status(200).json(unidades);
  } catch (erro) {
    return erroInterno(res, "listarInternas", erro);
  }
}

// GET /api/unidades/:id
async function buscar(req, res) {
  const id = validarId(req, res);
  if (id === null) return;

  try {
    const unidade = await prisma.unidade.findUnique({
      where: { id },
      select: CAMPOS_INTERNOS
    });

    if (
      !unidade ||
      (!unidade.ativa && req.usuario.perfil !== "ADMINISTRADOR")
    ) {
      return res.status(404).json({ erro: "Unidade não encontrada." });
    }

    return res.status(200).json(unidade);
  } catch (erro) {
    return erroInterno(res, "buscar", erro);
  }
}

// POST /api/unidades
async function cadastrar(req, res) {
  const { erro, dados } = validarCorpo(req.body || {});
  if (erro) return res.status(400).json({ erro });

  try {
    if (await buscarDuplicada(dados.nome, dados.endereco)) {
      return res.status(409).json({
        erro: "Já existe uma unidade com este nome e endereço."
      });
    }

    const criada = await prisma.unidade.create({
      data: {
        ...dados,
        nomeNormalizado: normalizarTexto(dados.nome),
        enderecoNormalizado: normalizarTexto(dados.endereco),
        ativa: true,
        criadoEm: new Date()
      },
      select: CAMPOS_INTERNOS
    });

    return res.status(201).json(criada);
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({
        erro: "Já existe uma unidade com este nome e endereço."
      });
    }
    return erroInterno(res, "cadastrar", e);
  }
}

// PUT /api/unidades/:id
async function editar(req, res) {
  const id = validarId(req, res);
  if (id === null) return;

  const corpo = req.body || {};
  const { erro, dados } = validarCorpo(corpo);
  if (erro) return res.status(400).json({ erro });

  try {
    const existente = await prisma.unidade.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!existente) {
      return res.status(404).json({ erro: "Unidade não encontrada." });
    }

    const duplicada = await buscarDuplicada(dados.nome, dados.endereco);
    if (duplicada && duplicada.id !== existente.id) {
      return res.status(409).json({
        erro: "Já existe outra unidade com este nome e endereço."
      });
    }

    const novosDados = {
      ...dados,
      nomeNormalizado: normalizarTexto(dados.nome),
      enderecoNormalizado: normalizarTexto(dados.endereco)
    };
    if (typeof corpo.ativa === "boolean") {
      novosDados.ativa = corpo.ativa;
    }

    const atualizada = await prisma.unidade.update({
      where: { id: existente.id },
      data: novosDados,
      select: CAMPOS_INTERNOS
    });

    return res.status(200).json(atualizada);
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({
        erro: "Já existe outra unidade com este nome e endereço."
      });
    }
    return erroInterno(res, "editar", e);
  }
}

// PATCH /api/unidades/:id/inativar
async function inativar(req, res) {
  const id = validarId(req, res);
  if (id === null) return;

  try {
    const existente = await prisma.unidade.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!existente) {
      return res.status(404).json({ erro: "Unidade não encontrada." });
    }

    const inativada = await prisma.unidade.update({
      where: { id: existente.id },
      data: { ativa: false },
      select: CAMPOS_INTERNOS
    });

    return res.status(200).json(inativada);
  } catch (erro) {
    return erroInterno(res, "inativar", erro);
  }
}

// DELETE /api/unidades/:id
async function excluir(req, res) {
  const id = validarId(req, res);
  if (id === null) return;

  try {
    const existente = await prisma.unidade.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!existente) {
      return res.status(404).json({ erro: "Unidade não encontrada." });
    }

    const vinculados = await prisma.encaminhamento.count({
      where: { unidadeDestinoId: existente.id }
    });
    if (vinculados > 0) {
      return res.status(409).json({
        erro:
          "Esta unidade possui encaminhamentos vinculados e não pode ser excluída. Inative-a."
      });
    }

    await prisma.unidade.delete({ where: { id: existente.id } });
    return res.status(200).json({ mensagem: "Unidade excluída com sucesso." });
  } catch (erro) {
    if (erro.code === "P2003") {
      return res.status(409).json({
        erro:
          "Esta unidade possui registros vinculados e não pode ser excluída. Inative-a."
      });
    }
    return erroInterno(res, "excluir", erro);
  }
}

module.exports = {
  listarPublicas,
  listarInternas,
  buscar,
  cadastrar,
  editar,
  inativar,
  excluir
};