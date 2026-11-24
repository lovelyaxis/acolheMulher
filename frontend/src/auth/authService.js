/**
 * Serviço de autenticação do AcolheMulher (integração com o back-end).
 *
 * Toda chamada vai para a API real (POST /api/auth/login, GET /api/auth/me,
 * etc.) e o token JWT recebido é guardado na sessão do navegador
 * (arquivo session.js), nunca em texto puro na variável de código.
 *
 * Requisitos atendidos:
 *  - RF007: login com e-mail e senha, token JWT, bloqueio de 15 min após 5 erros
 *  - RF009: logout e encerramento de sessão
 *  - RNF001: senhas verificadas com hash no servidor (bcrypt), nunca no front
 */
import { api } from "../services/api";
import {
  limparSession,
  lerSession,
  gravarSession,
} from "./session";

// Tempo de reserva para expiração de token, se a API não informar (8 horas).
const TEMPO_EXPIRACAO_RESERVA = 8 * 60 * 60 * 1000;

// Campos do usuário que interessam ao front-end (sem expor o hash de senha).
function dadosUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    unidade: usuario.unidadeId ?? null,
    cargo: usuario.cargo ?? null,
  };
}

/**
 * Autentica o usuário com e-mail e senha.
 *
 * Retorna:
 *  { ok: true, token, usuario }                         — credenciais válidas
 *  { ok: false, codigo: "bloqueado", bloqueadoAte }     — conta bloqueada
 *  { ok: false, codigo: "credenciais_invalidas", ... }  — senha/e-mail inválidos
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
    const dados = await api.post("/auth/login", { email, senha });

    const usuario = dadosUsuario(dados.usuario);
    const expiraEm =
      dados.expiraEm || Date.now() + TEMPO_EXPIRACAO_RESERVA;

    gravarSession(dados.token, usuario, expiraEm);

    return {
      ok: true,
      token: dados.token,
      usuario,
    };
  } catch (erro) {
    // 429 = conta bloqueada (RN005); 401 = credenciais inválidas.
    if (erro.status === 429) {
      return {
        ok: false,
        codigo: "bloqueado",
        bloqueadoAte: erro.dados?.bloqueadoAte,
        tentativasRestantes: Number(erro.dados?.tentativasRestantes) || 0,
        mensagem:
          erro.mensagem ||
          "Conta temporariamente bloqueada por muitas tentativas.",
      };
    }

    return {
      ok: false,
      codigo: "credenciais_invalidas",
      mensagem: erro.mensagem || "E-mail ou senha inválidos.",
    };
  }
}

/**
 * Encerra a sessão. Avisa o servidor (best effort) e limpa o localStorage.
 */
export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // Falha ao avisar o servidor: ainda assim encerra a sessão local.
  }
  limparSession();
}

/**
 * Verifica se há uma sessão ativa válida.
 */
export function estaAutenticado() {
  return lerSession() !== null;
}

/**
 * Retorna os dados do usuário da sessão atual, ou null.
 */
export function usuarioLogado() {
  const session = lerSession();
  return session ? session.usuario : null;
}

/**
 * Retorna o token de sessão atual, ou null.
 */
export function tokenSessao() {
  const session = lerSession();
  return session ? session.token : null;
}

/**
 * Confirma a sessão no servidor (GET /api/auth/me).
 */
export async function verificarSessao() {
  try {
    const dados = await api.get("/auth/me");
    return { valida: true, usuario: dadosUsuario(dados.usuario) };
  } catch {
    limparSession();
    return { valida: false };
  }
}
