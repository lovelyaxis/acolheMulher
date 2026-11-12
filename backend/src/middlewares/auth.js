const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

async function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || "";
  const [tipo, token] = cabecalho.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Autenticação necessária." });
  }

  const segredo = process.env.JWT_SECRET;
  if (!segredo) {
    console.error("JWT_SECRET não configurada no .env");
    return res.status(500).json({ erro: "Servidor mal configurado." });
  }

  let dados;
  try {
    dados = jwt.verify(token, segredo, { algorithms: ["HS256"] });
  } catch (erro) {
    return res.status(401).json({
      erro: "Sessão inválida ou expirada. Faça login novamente."
    });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: dados.id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        cargo: true,
        unidadeId: true,
        ativo: true
      }
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: "Conta inativa ou inexistente." });
    }

    req.usuario = usuario;
    return next();
  } catch (erro) {
    console.error("Erro ao validar usuário autenticado:", erro.message);
    return res.status(500).json({ erro: "Erro interno ao validar a sessão." });
  }
}

function autorizar(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        erro: "Você não tem permissão para acessar este recurso."
      });
    }
    return next();
  };
}

module.exports = { autenticar, autorizar };