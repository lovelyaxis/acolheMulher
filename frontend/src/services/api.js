import { tokenSessao, limparSession } from "../auth/session";

// Em desenvolvimento usa o proxy do Vite ("/api").
// Em produção, defina VITE_API_URL com o endereço da API.
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

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
  const headers = {};
  if (corpo !== undefined) headers["Content-Type"] = "application/json";

  // O token vai no cabeçalho Authorization em toda chamada protegida.
  const token = autenticado ? tokenSessao() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let resposta;
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      method: metodo,
      headers,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch (erro) {
    throw new ErroApi(
      0,
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    );
  }

  let dados = null;
  try {
    dados = await resposta.json();
  } catch (erro) {
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