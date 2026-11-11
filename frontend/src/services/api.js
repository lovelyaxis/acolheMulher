import { tokenSessao, limparSession } from "../auth/session";

// Em desenvolvimento usa o proxy do Vite ("/api").
// Em produção, defina VITE_API_URL com o endereço da API.
const URL_BASE = normalizarBase(import.meta.env.VITE_API_URL || "/api");

// Tempo máximo de espera por resposta (15 segundos).
const TIMEOUT_REQUISICAO = 15000;

// Remove barras finais para não montar caminhos com "//".
function normalizarBase(url) {
  const base = String(url).trim().replace(/\/+$/, "");
  return base || "/api";
}

export class ErroApi extends Error {
  constructor(status, mensagem, dados) {
    super(mensagem);
    this.name = "ErroApi";
    this.status = status; // 0 = não conseguiu conectar
    this.dados = dados;
  }
}

export async function requisicao(
  metodo,
  caminho,
  { corpo, autenticado = true } = {},
) {
  const headers = { Accept: "application/json" };
  if (corpo !== undefined) headers["Content-Type"] = "application/json";

  // O token vai no cabeçalho Authorization em toda chamada protegida.
  const token = autenticado ? tokenSessao() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  // Interrompe a requisição se o servidor não responder a tempo.
  const controlador = new AbortController();
  const temporizador = setTimeout(
    () => controlador.abort(),
    TIMEOUT_REQUISICAO,
  );

  try {
    let resposta;
    try {
      resposta = await fetch(`${URL_BASE}${caminho}`, {
        method: metodo,
        headers,
        body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
        signal: controlador.signal,
      });
    } catch {
      // Falha de rede ou tempo esgotado: mesmo tratamento de conexão.
      throw new ErroApi(
        0,
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      );
    }

    let dados = null;
    try {
      dados = await resposta.json();
    } catch {
      // resposta sem corpo
    }

    if (!resposta.ok) {
      // Token inválido ou expirado: encerra a sessão local.
      if (resposta.status === 401 && token) {
        limparSession();
        window.dispatchEvent(new Event("am:sessao-expirada"));
      }

      // Detecta falha do servidor ou do proxy sem resposta JSON.
      if (resposta.status >= 500 && dados === null) {
        throw new ErroApi(
          0,
          "Não foi possível conectar ao servidor. Verifique se o backend está ligado e tente novamente.",
        );
      }

      throw new ErroApi(
        resposta.status,
        (dados && dados.erro) || "Ocorreu um erro inesperado. Tente novamente.",
        dados,
      );
    }

    return dados;
  } finally {
    clearTimeout(temporizador);
  }
}

export const api = {
  get: (caminho, opcoes) => requisicao("GET", caminho, opcoes),
  post: (caminho, corpo, opcoes) =>
    requisicao("POST", caminho, { ...opcoes, corpo }),
  put: (caminho, corpo, opcoes) =>
    requisicao("PUT", caminho, { ...opcoes, corpo }),
  patch: (caminho, corpo, opcoes) =>
    requisicao("PATCH", caminho, { ...opcoes, corpo }),
  delete: (caminho, opcoes) => requisicao("DELETE", caminho, opcoes),
};
