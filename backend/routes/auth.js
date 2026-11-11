/**
 * Rotas de autenticação — AcolheMulher
 *
 * POST /api/login   — autentica com bcrypt contra a tabela usuario; retorna token + usuário
 * POST /api/logout  — encerra a sessão (cliente descarta o token)
 * GET  /api/me      — retorna os dados do usuário autenticado
 *
 * Regras de segurança (RN005):
 *   - Após 5 erros de senha consecutivos, bloqueia a conta por 15 minutos
 *   - Usa os campos tentativasLogin e bloqueadoAte do schema Usuario
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { exigirLogin, exigirPerfil, JWT_SECRET, JWT_EXPIRES_IN } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const MAX_ERROS = 5;
const BLOQUEIO_MINUTOS = 15;

/**
 * POST /api/login
 * Content-Type: application/json
 * Body: { email: string, senha: string }
 *
 * Sucesso (200):
 *   { token: string, usuario: { id, nome, perfil } }
 *
 * Erros:
 *   400 — e-mail/senha ausentes
 *   401 — credenciais inválidas / usuário inativo / senha errada
 *   403 — conta bloqueada (15 min após 5 erros)
 */
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      // Não revela se o e-mail existe
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    if (!usuario.ativo) {
      return res.status(401).json({ erro: 'Usuário inativo.' });
    }

    const agora = new Date();

    // Conta bloqueada?
    if (usuario.bloqueadoAte && new Date(usuario.bloqueadoAte) > agora) {
      return res.status(403).json({
        erro: 'Conta temporariamente bloqueada por excesso de tentativas de login.',
        bloqueadoAte: usuario.bloqueadoAte,
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

    if (senhaValida) {
      // Login bem-sucedido: zera tentativas e remove bloqueio
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { tentativasLogin: 0, bloqueadoAte: null },
      });

      const token = jwt.sign(
        { id: usuario.id, perfil: usuario.perfil },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.json({
        token,
        usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
      });
    }

    // Senha inválida: incrementa tentativas e bloqueia se atingir o limite
    const tentativas = Number(usuario.tentativasLogin || 0) + 1;
    const dadosAtualizacao = { tentativasLogin: tentativas };

    if (tentativas >= MAX_ERROS) {
      dadosAtualizacao.bloqueadoAte = new Date(Date.now() + BLOQUEIO_MINUTOS * 60 * 1000);
    }

    await prisma.usuario.update({ where: { id: usuario.id }, data: dadosAtualizacao });

    if (tentativas >= MAX_ERROS) {
      return res.status(403).json({
        erro: 'Conta bloqueada por 15 minutos após 5 tentativas falhas de login.',
        bloqueadoAte: dadosAtualizacao.bloqueadoAte,
      });
    }

    return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

/**
 * POST /api/logout
 * Header: Authorization: Bearer <token>  (opcional; o JWT é stateless)
 *
 * Sucesso (200):
 *   { mensagem: string }
 *
 * Observação: como o JWT é stateless, o logout consiste em instruir o cliente a
 * descartar o token. Se estiver usando cookie, limpe o cookie do lado do cliente.
 */
router.post('/logout', exigirLogin, (_req, res) => {
  res.json({ mensagem: 'Logout realizado com sucesso.' });
});

/**
 * GET /api/me
 * Header: Authorization: Bearer <token>
 *
 * Sucesso (200):
 *   { usuario: { id, nome, email, perfil, ativo } }
 *
 * Erros:
 *   401 — não autenticado
 *   404 — usuário não encontrado
 *   500 — erro interno
 */
router.get('/me', exigirLogin, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: { id: true, nome: true, email: true, perfil: true, ativo: true },
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.json({ usuario });
  } catch (err) {
    console.error('Erro ao buscar /me:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

module.exports = router;
