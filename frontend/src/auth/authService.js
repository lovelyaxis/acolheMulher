/**
 * Serviço de autenticação do AcolheMulher.
 *
 * Agora conversa com a API real (POST /api/auth/login e GET /api/auth/me).
 * Validação de senha, token JWT e bloqueio de 5 tentativas / 15 minutos
 * acontecem no servidor (RF007, RN005). O front-end apenas guarda a sessão.
 * Os nomes das funções exportadas foram mantidos para não quebrar as páginas.
 */
import { api, ErroApi } from "../services/api";
import {
  gravarSession,
  limparSession,
  lerSession,
  tokenSessao as lerToken,
  usuarioSessao,
} from "./session";

// O perfil já vem do servidor em maiúsculas (PROFISSIONAL ou ADMINISTRADOR),
// o mesmo formato que o ProtectedRoute e as páginas usam.
function converterUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    cargo: usuario.cargo ?? null,
    unidadeId: usuario.unidadeId ?? null,
    unidade: usuario.unidade ?? null,
  };
}

export { limparSession };

// Mantidas apenas por compatibilidade: o controle de tentativas agora
// fica no servidor e no banco, não mais no navegador.
export function lerTentativas() {
  return 0;
}

export function lerBloqueioAte() {
  return null;
}

/**
 * Autentica o usuário com e-mail e senha.
 *
 * Retorna:
 *  { ok: true, token, usuario, expiraEm }
 *  { ok: false, codigo: "bloqueado", bloqueadoAte, minutosRestantes,
 *      tentativasRestantes, mensagem }
 *  { ok: false, codigo: "credenciais_invalidas", tentativasRestantes, mensagem }
 *  { ok: false, codigo: "conta_inativa" | "dados_invalidos" |
 *      "erro_conexao" | "erro_servidor" | "campos_obrigatorios", mensagem }
 */
export async function login(email, senha) {
  if (!email || !senha) {
    return {
      ok: false,
      codigo: "campos_obrigatorios",
      mensagem: "Preencha o e-mail e a senha.",
    };
  }

  try {
    const dados = await api.post(
      "/auth/login",
      { email: String(email).trim(), senha },
      { autenticado: false },
    );

    const usuario = converterUsuario(dados.usuario);
    gravarSession(dados.token, usuario, dados.expiraEm);

    return {
      ok: true,
      token: dados.token,
      usuario,
      expiraEm: dados.expiraEm ?? null,
    };
  } catch (erro) {
    if (!(erro instanceof ErroApi)) throw erro;

    if (erro.status === 0) {
      return { ok: false, codigo: "erro_conexao", mensagem: erro.message };
    }

    if (erro.status === 400) {
      return {
        ok: false,
        codigo: "dados_invalidos",
        mensagem: erro.message || "Informe um e-mail e uma senha válidos.",
      };
    }

    if (erro.status === 429) {
      const bloqueadoAte =
        erro.dados && erro.dados.bloqueadoAte
          ? Number(erro.dados.bloqueadoAte)
          : null;
      const tentativasRestantes =
        erro.dados && typeof erro.dados.tentativasRestantes === "number"
          ? erro.dados.tentativasRestantes
          : 0;
      return {
        ok: false,
        codigo: "bloqueado",
        bloqueadoAte,
        tentativasRestantes,
        minutosRestantes: bloqueadoAte
          ? Math.max(1, Math.ceil((bloqueadoAte - Date.now()) / 60000))
          : undefined,
        mensagem: erro.message,
      };
    }

    if (erro.status === 401) {
      const tentativasRestantes =
        erro.dados && typeof erro.dados.tentativasRestantes === "number"
          ? erro.dados.tentativasRestantes
          : undefined;
      return {
        ok: false,
        codigo: "credenciais_invalidas",
        tentativasRestantes,
        mensagem: erro.message,
      };
    }

    if (erro.status === 403) {
      return { ok: false, codigo: "conta_inativa", mensagem: erro.message };
    }

    return { ok: false, codigo: "erro_servidor", mensagem: erro.message };
  }
}

/**
 * Confere no servidor se a sessão guardada ainda é válida (GET /api/auth/me).
 * Retorna { valida: true, usuario } ou { valida: false }.
 * Se o servidor estiver fora do ar, mantém a sessão guardada.
 */
export async function verificarSessao() {
  if (!lerSession()) return { valida: false };

  try {
    const dados = await api.get("/auth/me");
    return { valida: true, usuario: converterUsuario(dados.usuario) };
  } catch (erro) {
    if (erro instanceof ErroApi && (erro.status === 401 || erro.status === 403)) {
      limparSession();
      return { valida: false };
    }
    return { valida: true, usuario: usuarioSessao() };
  }
}

/**
 * Encerra a sessão do usuário (logout), removendo o token do navegador.
 */
export function logout() {
  limparSession();
}

export function estaAutenticado() {
  return lerSession() !== null;
}

export function usuarioLogado() {
  return usuarioSessao();
}

export function tokenSessao() {
  return lerToken();
}