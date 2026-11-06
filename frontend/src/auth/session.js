// Guarda e lê a sessão (token + usuário) no navegador.
// O token é emitido pelo servidor; o front-end nunca gera token.

const CHAVE_SESSION = "am_session";

// Mesma validade do token emitido pelo servidor: 8 horas (em ms).
const TEMPO_EXPIRACAO_TOKEN = 8 * 60 * 60 * 1000;

export function limparSession() {
  localStorage.removeItem(CHAVE_SESSION);
  // Chaves antigas do login simulado, caso ainda existam.
  localStorage.removeItem("am_tentativas");
  localStorage.removeItem("am_bloqueado_ate");
}

export function lerSession() {
  try {
    const bruto = localStorage.getItem(CHAVE_SESSION);
    if (!bruto) return null;
    const session = JSON.parse(bruto);
    if (!session || !session.token || !session.expiraEm) return null;
    if (Date.now() > session.expiraEm) {
      limparSession();
      return null;
    }
    return session;
  } catch (erro) {
    limparSession();
    return null;
  }
}

export function gravarSession(token, usuario) {
  const session = {
    token,
    usuario,
    expiraEm: Date.now() + TEMPO_EXPIRACAO_TOKEN,
  };
  localStorage.setItem(CHAVE_SESSION, JSON.stringify(session));
}

export function tokenSessao() {
  const session = lerSession();
  return session ? session.token : null;
}

export function usuarioSessao() {
  const session = lerSession();
  return session ? session.usuario : null;
}