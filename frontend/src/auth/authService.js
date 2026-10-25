/**
 * Serviço de autenticação (mock) do AcolheMulher.
 *
 * ATENÇÃO: este é um MOCK temporário, usado enquanto o back-end não está
 * definido (veja AGENTS.md). Toda a lógica abaixo deve ser substituída por
 * chamadas reais à API (POST /login, POST /logout, etc.) quando o back-end
 * estiver pronto. Mantenha a mesma assinatura de funções para facilitar a troca.
 *
 * Requisitos atendidos (simulados):
 *  - RF007: login com e-mail e senha, redirecionamento por perfil
 *  - RNF001: senhas comparadas por hash (SHA-256), nunca em texto puro
 *  - RN005: bloqueio de 15 minutos após 5 tentativas incorretas
 *  - RF009: geração de token de sessão e logout
 */
import { buscarUsuarioPorEmail } from "../mocks/usuarios";

// Tempo de expiração do token de sessão: 8 horas (em ms).
const TEMPO_EXPIRACAO_TOKEN = 8 * 60 * 60 * 1000;

// Tempo de bloqueio da conta após 5 tentativas erradas: 15 minutos (em ms).
const TEMPO_BLOQUEIO = 15 * 60 * 1000;

// Número máximo de tentativas incorretas antes do bloqueio.
const MAX_TENTATIVAS = 5;

const CHAVE_SESSION = "am_session";
const CHAVE_TENTATIVAS = "am_tentativas";
const CHAVE_BLOQUEIO = "am_bloqueado_ate";

/**
 * Gera o hash SHA-256 de uma string e retorna o valor em hexadecimal.
 * Usa a Web Crypto API do navegador (sem dependências externas).
 */
async function hashSenha(senha) {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(senha)
  );
  const bytes = Array.from(new Uint8Array(buffer));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Lê a sessão armazenada no localStorage.
 * Retorna { token, usuario, expiraEm } ou null se não houver sessão válida.
 */
function lerSession() {
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

function gravarSession(token, usuario) {
  const session = {
    token,
    usuario,
    expiraEm: Date.now() + TEMPO_EXPIRACAO_TOKEN,
  };
  localStorage.setItem(CHAVE_SESSION, JSON.stringify(session));
}

export function limparSession() {
  localStorage.removeItem(CHAVE_SESSION);
  localStorage.removeItem(CHAVE_TENTATIVAS);
  localStorage.removeItem(CHAVE_BLOQUEIO);
}

/**
 * Retorna a data/hora até a qual a conta está bloqueada, ou null se não estiver.
 */
export function lerBloqueioAte() {
  try {
    const bruto = localStorage.getItem(CHAVE_BLOQUEIO);
    if (!bruto) return null;
    const até = Number(bruto);
    if (Date.now() > até) {
      localStorage.removeItem(CHAVE_BLOQUEIO);
      return null;
    }
    return até;
  } catch (erro) {
    return null;
  }
}

/**
 * Retorna o número de tentativas incorretas acumuladas atualmente.
 */
export function lerTentativas() {
  try {
    const bruto = localStorage.getItem(CHAVE_TENTATIVAS);
    return bruto ? Number(bruto) : 0;
  } catch (erro) {
    return 0;
  }
}

/**
 * Autentica o usuário com e-mail e senha.
 *
 * Retorna:
 *  { ok: true, token, usuario }                  — credenciais válidas
 *  { ok: false, codigo: "bloqueado", bloqueadoAte } — conta bloqueada
 *  { ok: false, codigo: "senha_invalida", tentativas, tentativasRestantes, bloqueadoAte? }
 *                                                 — senha incorreta
 *  { ok: false, codigo: "usuario_nao_encontrado" }  — e-mail não cadastrado
 */
export async function login(email, senha) {
  if (!email || !senha) {
    return {
      ok: false,
      codigo: "campos_obrigatorios",
      mensagem: "Preencha o e-mail e a senha.",
    };
  }

  // Conta bloqueada? Impede qualquer tentativa.
  const bloqueadoAte = lerBloqueioAte();
  if (bloqueadoAte) {
    const minutosRestantes = Math.ceil((bloqueadoAte - Date.now()) / 60000);
    return {
      ok: false,
      codigo: "bloqueado",
      bloqueadoAte,
      minutosRestantes,
      mensagem: `Sua conta está temporariamente bloqueada por muitas tentativas. Tente novamente em ${minutosRestantes} minuto(s).`,
    };
  }

  const usuario = buscarUsuarioPorEmail(email);
  if (!usuario) {
    // Usuário não cadastrado: não revela se o e-mail existe (boas práticas de segurança).
    return {
      ok: false,
      codigo: "credenciais_invalidas",
      mensagem: "E-mail ou senha inválidos.",
    };
  }

  const hashDigitada = await hashSenha(senha);
  const senhaCorreta = hashDigitada === usuario.senhaHash;

  if (senhaCorreta) {
    // Login bem-sucedido: zera tentativas, gera token de sessão e grava sessão.
    localStorage.removeItem(CHAVE_TENTATIVAS);
    localStorage.removeItem(CHAVE_BLOQUEIO);
    const token = crypto.randomUUID() + "." + Date.now();
    gravarSession(token, {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      unidade: usuario.unidade,
      cargo: usuario.cargo,
    });
    return {
      ok: true,
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        unidade: usuario.unidade,
        cargo: usuario.cargo,
      },
    };
  }

  // Senha incorreta: incrementa tentativas e bloqueia se atingir o limite.
  const tentativas = lerTentativas() + 1;
  localStorage.setItem(CHAVE_TENTATIVAS, String(tentativas));

  let bloqueadoAteAgora = null;
  if (tentativas >= MAX_TENTATIVAS) {
    bloqueadoAteAgora = Date.now() + TEMPO_BLOQUEIO;
    localStorage.setItem(CHAVE_BLOQUEIO, String(bloqueadoAteAgora));
  }

  return {
    ok: false,
    codigo: "credenciais_invalidas",
    tentativas,
    tentativasRestantes: MAX_TENTATIVAS - tentativas,
    bloqueadoAte: bloqueadoAteAgora,
    mensagem:
      tentativas >= MAX_TENTATIVAS
        ? `Você errou a senha ${MAX_TENTATIVAS} vezes. Sua conta foi bloqueada por 15 minutos.`
        : `E-mail ou senha inválidos. Tentativa ${tentativas} de ${MAX_TENTATIVAS}.`,
  };
}

/**
 * Encerra a sessão do usuário (logout). Redireciona não é responsabilidade desta função.
 */
export function logout() {
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
