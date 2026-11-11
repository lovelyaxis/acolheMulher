// Guarda e lê a sessão (token + usuário) no navegador.
// O token é emitido pelo servidor; o front-end nunca gera token.

export const CHAVE_SESSION = "am_session";

// Usada apenas como reserva quando a API não informa o prazo real do token.
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
  } catch {
    limparSession();
    return null;
  }
}

/**
 * Grava a sessão usando o vencimento informado pelo servidor.
 * Se a API não enviar um `expiraEm` válido, usa 8 horas como reserva.
 */
export function gravarSession(token, usuario, expiraEm) {
  const agora = Date.now();
  const expiracaoValida =
    Number.isFinite(expiraEm) && expiraEm > agora;

  const session = {
    token,
    usuario,
    expiraEm: expiracaoValida ? expiraEm : agora + TEMPO_EXPIRACAO_TOKEN,
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
