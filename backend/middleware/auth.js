/**
 * Middleware de autenticação e autorização — AcolheMulher
 *
 * - exigirLogin        : valida o JWT (header Authorization: Bearer <token> ou cookie token)
 *                         e preenche req.usuario = { id, perfil }
 * - exigirPerfil(...p) : verifica se req.usuario.perfil está entre os perfis permitidos
 *
 * Variáveis de ambiente:
 *   JWT_SECRET   — segredo para assinar/verificar JWT (padrão: valor de dev)
 *   JWT_EXPIRES_IN — expiração do token (padrão: 24h)
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'acolhemulher_dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/** Extrai o JWT da requisição (Bearer ou cookie). */
function extrairToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  const cookies = req.cookies || {};
  return cookies.token || null;
}

/**
 * Middleware: exige autenticação.
 * Preenche req.usuario = { id, perfil } quando o token é válido.
 */
function exigirLogin(req, res, next) {
  const token = extrairToken(req);
  if (!token) {
    return res.status(401).json({ erro: 'Não autenticado. Faça login.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = { id: decoded.id, perfil: decoded.perfil };
    return next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

/**
 * Middleware factory: exige que o perfil do usuário autenticado esteja na lista.
 * Uso: router.get('/', exigirLogin, exigirPerfil('ADMINISTRADOR'), ...)
 *      router.get('/', exigirLogin, exigirPerfil('ADMINISTRADOR', 'PROFISSIONAL'), ...)
 */
function exigirPerfil(...perfis) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Não autenticado.' });
    }
    if (!perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({ erro: 'Acesso negado. Perfil não autorizado.' });
    }
    return next();
  };
}

module.exports = { exigirLogin, exigirPerfil, extrairToken, JWT_SECRET, JWT_EXPIRES_IN };
