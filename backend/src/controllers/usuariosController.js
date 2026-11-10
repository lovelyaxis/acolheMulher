const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

const PERFIS = ["PROFISSIONAL", "ADMINISTRADOR"];
const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Campos devolvidos: nunca inclui senhaHash.
const CAMPOS = {
  id: true,
  nome: true,
  email: true,
  perfil: true,
  cargo: true,
  unidadeId: true,
  ativo: true,
  bloqueadoAte: true,
  criadoEm: true,
  atualizadoEm: true,
  unidade: { select: { id: true, nome: true } }
};

function limpar(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function erroInterno(res, contexto, erro) {
  console.error(`Erro em usuários (${contexto}):`, erro.message);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}

async function validar(corpo, senhaObrigatoria) {
  const nome = limpar(corpo.nome);
  const email = limpar(corpo.email).toLowerCase();
  const cargo = limpar(corpo.cargo);

  if (!nome || nome.length > 100) {
    return { erro: "Informe o nome (até 100 caracteres)." };
  }
  if (!email || email.length > 150 || !EMAIL_REGEX.test(email)) {
    return { erro: "Informe um e-mail válido." };
  }
  if (cargo.length > 100) {
    return { erro: "O cargo deve ter no máximo 100 caracteres." };
  }

  let perfil;
  if (corpo.perfil !== undefined) {
    if (!PERFIS.includes(corpo.perfil)) {
      return { erro: `Perfil inválido. Use: ${PERFIS.join(", ")}.` };
    }
    perfil = corpo.perfil;
  }

  let unidadeId = null;
  if (
    corpo.unidadeId !== undefined &&
    corpo.unidadeId !== null &&
    corpo.unidadeId !== ""
  ) {
    if (typeof corpo.unidadeId !== "string") {
      return { erro: "Unidade inválida." };
    }
    const unidade = await prisma.unidade.findUnique({
      where: { id: corpo.unidadeId },
      select: { id: true }
    });
    if (!unidade) {
      return { erro: "A unidade informada não existe." };
    }
    unidadeId = unidade.id;
  }

  const senha = corpo.senha;
  const temSenha = senha !== undefined && senha !== null && senha !== "";
  if (senhaObrigatoria && !temSenha) {
    return { erro: "Informe a senha." };
  }
  if (temSenha) {
    if (typeof senha !== "string" || senha.length < 8 || senha.length > 72) {
      return { erro: "A senha deve ter entre 8 e 72 caracteres." };
    }
  }

  return {
    dados: { nome, email, cargo: cargo || null, perfil, unidadeId },
    senha: temSenha ? senha : null
  };
}

// GET /api/usuarios
async function listar(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: CAMPOS,
      orderBy: { nome: "asc" }
    });
    return res.status(200).json(usuarios);
  } catch (erro) {
    return erroInterno(res, "listar", erro);
  }
}

// GET /api/usuarios/:id
async function buscar(req, res) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.params.id },
      select: CAMPOS
    });
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    return res.status(200).json(usuario);
  } catch (erro) {
    return erroInterno(res, "buscar", erro);
  }
}

// POST /api/usuarios
async function cadastrar(req, res) {
  try {
    const { erro, dados, senha } = await validar(req.body || {}, true);
    if (erro) return res.status(400).json({ erro });

    const existente = await prisma.usuario.findUnique({
      where: { email: dados.email },
      select: { id: true }
    });
    if (existente) {
      return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
    }

    const criado = await prisma.usuario.create({
      data: {
        ...dados,
        perfil: dados.perfil || "PROFISSIONAL",
        senhaHash: await bcrypt.hash(senha, SALT_ROUNDS),
        ativo: true,
        criadoEm: new Date()
      },
      select: CAMPOS
    });

    return res.status(201).json(criado);
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
    }
    return erroInterno(res, "cadastrar", e);
  }
}

// PUT /api/usuarios/:id
async function editar(req, res) {
  try {
    const existente = await prisma.usuario.findUnique({
      where: { id: req.params.id },
      select: { id: true, perfil: true }
    });
    if (!existente) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const { erro, dados, senha } = await validar(req.body || {}, false);
    if (erro) return res.status(400).json({ erro });

    // Ninguém altera o próprio perfil (evita se promover ou se rebaixar).
    if (
      existente.id === req.usuario.id &&
      dados.perfil !== undefined &&
      dados.perfil !== existente.perfil
    ) {
      return res.status(400).json({
        erro: "Você não pode alterar o seu próprio perfil."
      });
    }

    const outro = await prisma.usuario.findUnique({
      where: { email: dados.email },
      select: { id: true }
    });
    if (outro && outro.id !== existente.id) {
      return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
    }

    const novosDados = { ...dados };
    if (novosDados.perfil === undefined) delete novosDados.perfil;
    if (senha) novosDados.senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const atualizado = await prisma.usuario.update({
      where: { id: existente.id },
      data: novosDados,
      select: CAMPOS
    });

    return res.status(200).json(atualizado);
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
    }
    return erroInterno(res, "editar", e);
  }
}

// PATCH /api/usuarios/:id/status  (corpo: { "ativo": true | false })
async function alterarStatus(req, res) {
  try {
    const { ativo } = req.body || {};
    if (typeof ativo !== "boolean") {
      return res.status(400).json({
        erro: "Informe o campo ativo como true ou false."
      });
    }

    const existente = await prisma.usuario.findUnique({
      where: { id: req.params.id },
      select: { id: true }
    });
    if (!existente) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    if (existente.id === req.usuario.id && ativo === false) {
      return res.status(400).json({
        erro: "Você não pode bloquear a sua própria conta."
      });
    }

    const data = ativo
      ? { ativo: true, tentativasLogin: 0, bloqueadoAte: null }
      : { ativo: false };

    const atualizado = await prisma.usuario.update({
      where: { id: existente.id },
      data,
      select: CAMPOS
    });

    return res.status(200).json(atualizado);
  } catch (erro) {
    return erroInterno(res, "alterarStatus", erro);
  }
}

// DELETE /api/usuarios/:id
async function excluir(req, res) {
  try {
    const existente = await prisma.usuario.findUnique({
      where: { id: req.params.id },
      select: { id: true }
    });
    if (!existente) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    if (existente.id === req.usuario.id) {
      return res.status(400).json({
        erro: "Você não pode excluir a sua própria conta."
      });
    }

    const vinculados = await prisma.encaminhamento.count({
      where: { profissionalId: existente.id }
    });
    if (vinculados > 0) {
      return res.status(409).json({
        erro:
          "Este profissional possui encaminhamentos e não pode ser excluído. Bloqueie a conta."
      });
    }

    await prisma.usuario.delete({ where: { id: existente.id } });
    return res.status(200).json({ mensagem: "Usuário excluído com sucesso." });
  } catch (erro) {
    if (erro.code === "P2003") {
      return res.status(409).json({
        erro:
          "Este usuário possui registros vinculados e não pode ser excluído. Bloqueie a conta."
      });
    }
    return erroInterno(res, "excluir", erro);
  }
}

module.exports = {
  listar,
  buscar,
  cadastrar,
  editar,
  alterarStatus,
  excluir
};