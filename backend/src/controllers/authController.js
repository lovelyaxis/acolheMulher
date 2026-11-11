const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const MAX_TENTATIVAS = 5;
const MINUTOS_BLOQUEIO = 15;

function dadosPublicos(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    cargo: usuario.cargo,
    unidadeId: usuario.unidadeId
  };
}

async function login(req, res) {
  const { email, senha } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof senha !== "string" ||
    email.trim() === "" ||
    senha === ""
  ) {
    return res.status(400).json({ erro: "Informe e-mail e senha." });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET não configurada no .env");
    return res.status(500).json({ erro: "Servidor mal configurado." });
  }

  try {
    const agora = new Date();

    const usuario = await prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!usuario) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        erro: "Conta inativa ou bloqueada. Procure o administrador."
      });
    }

    if (usuario.bloqueadoAte && usuario.bloqueadoAte > agora) {
      const minutos = Math.ceil((usuario.bloqueadoAte - agora) / 60000);
      return res.status(429).json({
        erro: `Conta temporariamente bloqueada. Tente novamente em ${minutos} minuto(s).`,
        bloqueadoAte: usuario.bloqueadoAte.getTime(),
        tentativasRestantes: 0
      });
    }

    // Se existia um bloqueio que já expirou, a contagem recomeça do zero.
    const tentativasAtuais = usuario.bloqueadoAte ? 0 : usuario.tentativasLogin;

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaCorreta) {
      const novasTentativas = tentativasAtuais + 1;
      const bloquear = novasTentativas >= MAX_TENTATIVAS;

      const bloqueioAte = bloquear
        ? new Date(agora.getTime() + MINUTOS_BLOQUEIO * 60 * 1000)
        : null;

      const tentativasRestantes = Math.max(
        0,
        MAX_TENTATIVAS - novasTentativas
      );

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          tentativasLogin: novasTentativas,
          bloqueadoAte: bloqueioAte
        }
      });

      if (bloquear) {
        return res.status(429).json({
          erro: `Conta bloqueada por ${MINUTOS_BLOQUEIO} minutos após ${MAX_TENTATIVAS} tentativas incorretas.`,
          bloqueadoAte: bloqueioAte.getTime(),
          tentativasRestantes
        });
      }

      return res.status(401).json({
        erro: "E-mail ou senha inválidos.",
        tentativasRestantes
      });
    }

    if (usuario.tentativasLogin !== 0 || usuario.bloqueadoAte) {
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { tentativasLogin: 0, bloqueadoAte: null }
      });
    }

    const expiracaoToken = process.env.JWT_EXPIRES_IN || "8h";

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: expiracaoToken }
    );

    // O prazo real vem do token emitido, não de uma constante no front-end.
    const tokenDecodificado = jwt.decode(token);
    const expiraEm = tokenDecodificado?.exp
      ? tokenDecodificado.exp * 1000
      : null;

    return res.status(200).json({
      token,
      expiraEm,
      usuario: dadosPublicos(usuario)
    });
  } catch (erro) {
    console.error("Erro no login:", erro.message);
    return res.status(500).json({ erro: "Erro interno ao realizar o login." });
  }
}

function me(req, res) {
  return res.status(200).json({ usuario: req.usuario });
}

function logout(_req, res) {
  // JWT é stateless: o servidor apenas confirma. O cliente descarta o token.
  return res.status(200).json({ mensagem: "Logout realizado com sucesso." });
}

module.exports = { login, me, logout };