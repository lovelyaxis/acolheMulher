
import { api, ErroApi } from "./api";

// Tipos apresentados nas telas.
export const TIPOS_UNIDADE = Object.freeze([
  "Delegacia da Mulher",
  "CRAS/CREAS",
  "Casa de Acolhimento",
  "Defensoria Pública",
  "Hospital de Referência",
]);

// Conversão entre os nomes exibidos no frontend e os códigos do backend.
const TIPOS_PARA_API = {
  "Delegacia da Mulher": "DELEGACIA_MULHER",
  "CRAS/CREAS": "CRAS_CREAS",
  "Casa de Acolhimento": "CASA_ACOLHIMENTO",
  "Defensoria Pública": "DEFENSORIA_PUBLICA",
  "Hospital de Referência": "HOSPITAL_REFERENCIA",
};

const TIPOS_DA_API = Object.fromEntries(
  Object.entries(TIPOS_PARA_API).map(([nome, codigo]) => [
    codigo,
    nome,
  ]),
);

export const MENSAGEM_UNIDADE_DUPLICADA =
  "Já existe uma unidade cadastrada com esse nome e endereço.";

export const MENSAGEM_UNIDADE_COM_ENCAMINHAMENTOS =
  "Esta unidade possui encaminhamentos vinculados e não pode ser excluída. Inative-a para preservar o histórico.";

export const MENSAGEM_UNIDADE_NAO_ENCONTRADA =
  "Unidade não encontrada.";

export class ErroUnidade extends Error {
  constructor(mensagem, codigo = "ERRO_UNIDADE") {
    super(mensagem);
    this.name = "ErroUnidade";
    this.codigo = codigo;
  }
}

// Converte o código do backend para o nome apresentado na tela.
function tipoParaTela(tipo) {
  return TIPOS_DA_API[tipo] || tipo || "";
}

// Converte o nome apresentado na tela para o código do backend.
function tipoParaApi(tipo) {
  return TIPOS_PARA_API[tipo] || tipo || "";
}

// Remove caracteres que não sejam números.
function normalizarCep(cep) {
  return String(cep ?? "").replace(/\D/g, "");
}

// Converte os dados recebidos do backend para o formato usado pelas telas.
function converterUnidade(unidade) {
  if (!unidade) return null;

  const resultado = {
    ...unidade,
    tipo: tipoParaTela(unidade.tipo),
  };

  // Não apresenta campos de vagas quando não se aplicam.
  if (
    resultado.vagasTotal === null ||
    resultado.vagasTotal === undefined
  ) {
    delete resultado.vagasTotal;
  }

  if (
    resultado.vagasDisponiveis === null ||
    resultado.vagasDisponiveis === undefined
  ) {
    delete resultado.vagasDisponiveis;
  }

  return resultado;
}

// Algumas APIs retornam diretamente uma lista; outras usam { unidades: [] }.
function extrairLista(resposta) {
  if (Array.isArray(resposta)) return resposta;
  if (Array.isArray(resposta?.unidades)) return resposta.unidades;
  if (Array.isArray(resposta?.dados)) return resposta.dados;
  return [];
}

// Algumas APIs retornam diretamente o registro; outras usam { unidade: {} }.
function extrairUnidade(resposta) {
  return resposta?.unidade || resposta?.dados || resposta;
}

// Transforma erros da API em erros compreensíveis para as telas.
function tratarErro(erro) {
  if (erro instanceof ErroUnidade) {
    return erro;
  }

  if (erro instanceof ErroApi) {
    if (erro.status === 409) {
      const mensagem =
        erro.message || MENSAGEM_UNIDADE_DUPLICADA;

      const codigo = mensagem.toLowerCase().includes("encaminhamento")
        ? "UNIDADE_COM_ENCAMINHAMENTOS"
        : "UNIDADE_DUPLICADA";

      return new ErroUnidade(
        codigo === "UNIDADE_COM_ENCAMINHAMENTOS"
          ? MENSAGEM_UNIDADE_COM_ENCAMINHAMENTOS
          : mensagem,
        codigo,
      );
    }

    if (erro.status === 404) {
      return new ErroUnidade(
        MENSAGEM_UNIDADE_NAO_ENCONTRADA,
        "UNIDADE_NAO_ENCONTRADA",
      );
    }

    return new ErroUnidade(
      erro.message || "Não foi possível realizar a operação.",
      "ERRO_API",
    );
  }

  return new ErroUnidade(
    erro?.message || "Ocorreu um erro inesperado.",
    "ERRO_UNIDADE",
  );
}

// Monta os parâmetros de pesquisa.
function montarParametros({ termo = "", tipo, incluirInativas } = {}) {
  const parametros = new URLSearchParams();

  if (termo.trim()) {
    parametros.set("busca", termo.trim());
  }

  if (tipo) {
    parametros.set("tipo", tipoParaApi(tipo));
  }

  if (incluirInativas !== undefined) {
    parametros.set("incluirInativas", String(incluirInativas));
  }

  const consulta = parametros.toString();
  return consulta ? `?${consulta}` : "";
}

// Prepara os dados para envio ao backend.
function prepararDados(dados = {}) {
  return {
    nome: String(dados.nome ?? "").trim(),
    tipo: tipoParaApi(dados.tipo),
    endereco: String(dados.endereco ?? "").trim(),
    bairro: String(dados.bairro ?? "").trim(),
    cep: normalizarCep(dados.cep),
    telefone: String(dados.telefone ?? "").trim(),
    horario: String(dados.horario ?? "").trim(),
    vagasTotal:
      dados.tipo === "Casa de Acolhimento" ||
      dados.tipo === "CASA_ACOLHIMENTO"
        ? Number(dados.vagasTotal ?? dados.capacidade)
        : null,
    vagasDisponiveis:
      dados.tipo === "Casa de Acolhimento" ||
      dados.tipo === "CASA_ACOLHIMENTO"
        ? Number(
            dados.vagasDisponiveis === "" ||
            dados.vagasDisponiveis === null ||
            dados.vagasDisponiveis === undefined
              ? dados.vagasTotal ?? dados.capacidade
              : dados.vagasDisponiveis,
          )
        : null,
  };
}

// Valida os dados antes de enviá-los.
function validarDados(dados) {
  if (!dados.nome) {
    throw new ErroUnidade(
      "Informe o nome da unidade.",
      "DADOS_INVALIDOS",
    );
  }

  if (!TIPOS_UNIDADE.includes(tipoParaTela(dados.tipo))) {
    throw new ErroUnidade(
      "Selecione um tipo de unidade válido.",
      "DADOS_INVALIDOS",
    );
  }

  if (!dados.endereco) {
    throw new ErroUnidade(
      "Informe o endereço da unidade.",
      "DADOS_INVALIDOS",
    );
  }

  if (!dados.bairro) {
    throw new ErroUnidade(
      "Informe o bairro da unidade.",
      "DADOS_INVALIDOS",
    );
  }

  if (dados.cep.length !== 8) {
    throw new ErroUnidade(
      "Informe um CEP válido com 8 números.",
      "DADOS_INVALIDOS",
    );
  }

  if (dados.telefone.length > 20) {
    throw new ErroUnidade(
      "O telefone deve ter no máximo 20 caracteres.",
      "DADOS_INVALIDOS",
    );
  }

  if (dados.horario.length > 100) {
    throw new ErroUnidade(
      "O horário deve ter no máximo 100 caracteres.",
      "DADOS_INVALIDOS",
    );
  }

  if (dados.tipo === "CASA_ACOLHIMENTO") {
    if (
      !Number.isInteger(dados.vagasTotal) ||
      dados.vagasTotal < 0
    ) {
      throw new ErroUnidade(
        "Informe uma capacidade válida para a Casa de Acolhimento.",
        "DADOS_INVALIDOS",
      );
    }

    if (
      !Number.isInteger(dados.vagasDisponiveis) ||
      dados.vagasDisponiveis < 0
    ) {
      throw new ErroUnidade(
        "Informe uma quantidade válida de vagas disponíveis.",
        "DADOS_INVALIDOS",
      );
    }

    if (dados.vagasDisponiveis > dados.vagasTotal) {
      throw new ErroUnidade(
        "As vagas disponíveis não podem ser maiores que a capacidade total.",
        "DADOS_INVALIDOS",
      );
    }
  }
}

// Consulta pública: retorna somente unidades ativas e sem informações de vagas.
export async function listarUnidades() {
  try {
    const resposta = await api.get("/unidades", {
      autenticado: false,
    });

    return extrairLista(resposta).map(converterUnidade);
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Pesquisa pública por nome, bairro, CEP ou tipo.
export async function buscarUnidades({ termo = "", tipo } = {}) {
  try {
    const parametros = montarParametros({ termo, tipo });

    const resposta = await api.get(`/unidades${parametros}`, {
      autenticado: false,
    });

    return extrairLista(resposta).map(converterUnidade);
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Consulta interna: exige autenticação.
// Administradores podem solicitar também unidades inativas.
export async function listarUnidadesInternas({
  termo = "",
  tipo,
  incluirInativas = false,
} = {}) {
  try {
    const parametros = montarParametros({
      termo,
      tipo,
      incluirInativas,
    });

    const resposta = await api.get(
      `/unidades/internas${parametros}`,
    );

    return extrairLista(resposta).map(converterUnidade);
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Consulta uma unidade pelo identificador.
export async function buscarUnidadePorId(id) {
  try {
    const resposta = await api.get(
      `/unidades/${encodeURIComponent(id)}`,
    );

    return converterUnidade(extrairUnidade(resposta));
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Cadastro de unidade (RF014).
export async function cadastrarUnidade(dados = {}) {
  try {
    const dadosApi = prepararDados(dados);
    validarDados(dadosApi);

    const resposta = await api.post("/unidades", dadosApi);

    return converterUnidade(extrairUnidade(resposta));
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Edição de unidade (RF015).
// Busca os dados atuais para preservar bairro, CEP e vagas não enviados pelo formulário.
export async function editarUnidade(id, dados = {}) {
  try {
    const atual = await buscarUnidadePorId(id);

    if (!atual) {
      throw new ErroUnidade(
        MENSAGEM_UNIDADE_NAO_ENCONTRADA,
        "UNIDADE_NAO_ENCONTRADA",
      );
    }

    const dadosCompletos = {
      ...atual,
      ...dados,
    };

    const dadosApi = prepararDados(dadosCompletos);

    // Se o formulário não informar vagas disponíveis, preserva o valor atual.
    if (
      dadosCompletos.tipo === "Casa de Acolhimento" &&
      dados.vagasDisponiveis === undefined
    ) {
      dadosApi.vagasDisponiveis =
        atual.vagasDisponiveis ?? atual.vagasTotal;
    }

    validarDados(dadosApi);

    const resposta = await api.put(
      `/unidades/${encodeURIComponent(id)}`,
      dadosApi,
    );

    return converterUnidade(extrairUnidade(resposta));
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Inativação: preserva o registro e seu histórico.
export async function inativarUnidade(id) {
  try {
    const resposta = await api.patch(
      `/unidades/${encodeURIComponent(id)}/inativar`,
      {},
    );

    return converterUnidade(extrairUnidade(resposta));
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Exclusão: o backend aplica a regra RN003 e bloqueia unidades
// que possuem encaminhamentos vinculados.
export async function excluirUnidade(id) {
  try {
    return await api.delete(
      `/unidades/${encodeURIComponent(id)}`,
    );
  } catch (erro) {
    throw tratarErro(erro);
  }
}
