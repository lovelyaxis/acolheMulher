// Serviço de unidades de atendimento.
// Único ponto do projeto que acessa o mock; as páginas usam apenas estas
// funções, para que a troca por chamadas reais seja feita aqui depois.
//
// Observação (RF003 x RF012): as funções públicas listarUnidades e
// buscarUnidades nunca devolvem dados de vagas. A visão interna usa
// listarUnidadesInternas, que devolve vagasTotal e vagasDisponiveis.
// Numa API real, essa separação também precisa ser garantida no servidor.
//
// Cadastro (RF014) e duplicidade (RN004): cadastrarUnidade valida os dados,
// rejeita duplicidades com ErroUnidade e adiciona a unidade ao mock em memória.
//
// Edição, inativação e exclusão segura (RF015, RN003): editarUnidade reusa a
// validação de duplicidade ignorando a própria unidade; inativarUnidade
// suspende o atendimento sem apagar o registro; excluirUnidade bloqueia a
// remoção quando há encaminhamentos vinculados, preservando o histórico.

import { TIPOS_UNIDADE, unidades } from "../mocks/unidades.js";

// A lista de tipos é reexportada aqui para que as telas importem apenas
// deste serviço e nunca acessem o mock diretamente (AGENTS.md).
export { TIPOS_UNIDADE };

export const MENSAGEM_UNIDADE_DUPLICADA =
  "Já existe uma unidade cadastrada com este nome e endereço. Confira os dados ou procure a unidade na gestão da rede.";

export const MENSAGEM_UNIDADE_COM_ENCAMINHAMENTOS =
  "Esta unidade possui encaminhamentos vinculados e não pode ser excluída. Inative a unidade para suspender o atendimento, preservando o histórico para relatórios.";

export const MENSAGEM_UNIDADE_NAO_ENCONTRADA =
  "Unidade não encontrada. Ela pode ter sido removida ou o endereço está incorreto.";

export class ErroUnidade extends Error {
  constructor(codigo, mensagem) {
    super(mensagem);
    this.name = "ErroUnidade";
    this.codigo = codigo;
  }
}

const normalizarTexto = (valor = "") =>
  String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const apenasDigitos = (valor = "") => String(valor).replace(/\D/g, "");

const copiarUnidade = (unidade) => ({ ...unidade });

// Converte um valor de vagas em inteiro não negativo.
// Vazio/null vira null; valor inválido vira NaN.
const converterVagas = (valor) => {
  if (valor === null || valor === undefined) return null;

  const texto = String(valor).trim();
  if (!texto) return null;

  const numero = Number(texto);
  return Number.isInteger(numero) && numero >= 0 ? numero : NaN;
};

const gerarIdUnidade = () => {
  const maiorNumero = unidades.reduce((maior, unidade) => {
    const digitos = String(unidade.id ?? "").replace(/\D/g, "");
    const numero = Number(digitos);

    return Number.isInteger(numero) ? Math.max(maior, numero) : maior;
  }, 0);

  return `unidade-${String(maiorNumero + 1).padStart(2, "0")}`;
};

// Duplicidade (RN004): compara nome + endereço sem acentos, maiúsculas
// ou espaços extras. Considera também unidades inativas.
export function existeUnidadeDuplicada({ nome, endereco, ignorarId } = {}) {
  const nomeNormalizado = normalizarTexto(nome);
  const enderecoNormalizado = normalizarTexto(endereco);

  if (!nomeNormalizado || !enderecoNormalizado) return false;

  return unidades.some((unidade) => {
    if (ignorarId && unidade.id === ignorarId) return false;

    return (
      normalizarTexto(unidade.nome) === nomeNormalizado &&
      normalizarTexto(unidade.endereco) === enderecoNormalizado
    );
  });
}

// Validação compartilhada entre cadastro (RF014) e edição (RF015).
// Normaliza os campos de texto, aplica as mesmas regras do cadastro e devolve
// os valores prontos para gravar. `ignorarId` evita que a própria unidade seja
// considerada duplicada ao editar (RN004). Lança ErroUnidade quando inválido.
const validarDadosUnidade = (dados = {}, { ignorarId } = {}) => {
  const nome = String(dados.nome ?? "").trim();
  const endereco = String(dados.endereco ?? "").trim();
  const tipo = String(dados.tipo ?? "").trim();
  const telefone = String(dados.telefone ?? "").trim();
  const horario = String(dados.horario ?? "").trim();
  const bairro = String(dados.bairro ?? "").trim();
  const cep = String(dados.cep ?? "").trim();

  if (!nome) {
    throw new ErroUnidade("DADOS_INVALIDOS", "Informe o nome da unidade.");
  }

  if (!TIPOS_UNIDADE.includes(tipo)) {
    throw new ErroUnidade(
      "DADOS_INVALIDOS",
      "Selecione um tipo de unidade válido.",
    );
  }

  if (!endereco) {
    throw new ErroUnidade("DADOS_INVALIDOS", "Informe o endereço da unidade.");
  }

  if (existeUnidadeDuplicada({ nome, endereco, ignorarId })) {
    throw new ErroUnidade("UNIDADE_DUPLICADA", MENSAGEM_UNIDADE_DUPLICADA);
  }

  let vagasTotal;
  let vagasDisponiveis;

  if (tipo === "Casa de Acolhimento") {
    vagasTotal = converterVagas(dados.vagasTotal);

    if (!Number.isInteger(vagasTotal)) {
      throw new ErroUnidade(
        "DADOS_INVALIDOS",
        "Informe o total de vagas da Casa de Acolhimento.",
      );
    }

    vagasDisponiveis = converterVagas(dados.vagasDisponiveis);

    if (vagasDisponiveis === null) {
      vagasDisponiveis = vagasTotal;
    }

    if (!Number.isInteger(vagasDisponiveis)) {
      throw new ErroUnidade(
        "DADOS_INVALIDOS",
        "Informe as vagas disponíveis como um número inteiro maior ou igual a zero.",
      );
    }

    if (vagasDisponiveis > vagasTotal) {
      throw new ErroUnidade(
        "DADOS_INVALIDOS",
        "As vagas disponíveis não podem ser maiores que o total de vagas.",
      );
    }
  }

  return {
    nome,
    tipo,
    endereco,
    bairro,
    cep,
    telefone,
    horario,
    vagasTotal,
    vagasDisponiveis,
  };
};

// Consulta pública (RF003): remove qualquer campo de vagas da resposta.
const semDadosDeVagas = (unidade) => {
  const copia = { ...unidade };

  delete copia.vagas;
  delete copia.vagasTotal;
  delete copia.vagasDisponiveis;

  return copia;
};

// Filtro compartilhado entre a consulta pública e a interna.
const filtrarUnidades = ({
  termo = "",
  tipo,
  incluirInativas = false,
} = {}) => {
  const termoTexto = normalizarTexto(termo);
  const termoDigitos = apenasDigitos(termo);
  const compararCep = termoDigitos.length > 0;
  const tipoNormalizado = normalizarTexto(tipo);

  return unidades
    .filter((unidade) => incluirInativas || unidade.ativa)
    .filter(
      (unidade) =>
        !tipoNormalizado || normalizarTexto(unidade.tipo) === tipoNormalizado,
    )
    .filter((unidade) => {
      if (!termoTexto) return true;

      const bairroConfere = normalizarTexto(unidade.bairro).includes(termoTexto);
      const cepConfere =
        compararCep && apenasDigitos(unidade.cep).includes(termoDigitos);

      return bairroConfere || cepConfere;
    });
};

export async function listarUnidades({ incluirInativas = false } = {}) {
  return filtrarUnidades({ incluirInativas }).map(semDadosDeVagas);
}

export async function buscarUnidades({ termo = "", tipo } = {}) {
  return filtrarUnidades({ termo, tipo, incluirInativas: false }).map(
    semDadosDeVagas,
  );
}

// Consulta interna (RF012): devolve as unidades com os dados de vagas.
export async function listarUnidadesInternas({
  termo = "",
  tipo,
  incluirInativas = false,
} = {}) {
  return filtrarUnidades({ termo, tipo, incluirInativas }).map(copiarUnidade);
}

// Cadastro de unidade (RF014). Adiciona ao mock em memória e devolve o
// registro criado; recarregar a página reinicia o mock.
export async function cadastrarUnidade(dados = {}) {
  const {
    nome,
    tipo,
    endereco,
    bairro,
    cep,
    telefone,
    horario,
    vagasTotal,
    vagasDisponiveis,
  } = validarDadosUnidade(dados);

  const novaUnidade = {
    id: gerarIdUnidade(),
    nome,
    tipo,
    endereco,
    bairro,
    cep,
    telefone,
    horario,
    ativa: true,
    totalEncaminhamentos: 0,
  };

  if (tipo === "Casa de Acolhimento") {
    novaUnidade.vagasTotal = vagasTotal;
    novaUnidade.vagasDisponiveis = vagasDisponiveis;
  }

  unidades.push(novaUnidade);

  return copiarUnidade(novaUnidade);
}

// Edição de unidade (RF015). Reusa a validação do cadastro com `ignorarId`
// para não acusar a própria unidade como duplicada (RN004). Preserva id,
// ativa e totalEncaminhamentos; ajusta os campos de vagas quando o tipo muda.
// Lança ErroUnidade ("UNIDADE_NAO_ENCONTRADA") se a unidade não existir.
export async function editarUnidade(id, dados = {}) {
  const indice = unidades.findIndex((unidade) => unidade.id === id);

  if (indice === -1) {
    throw new ErroUnidade(
      "UNIDADE_NAO_ENCONTRADA",
      MENSAGEM_UNIDADE_NAO_ENCONTRADA,
    );
  }

  const atual = unidades[indice];

  // Ao editar uma Casa de Acolhimento mantendo o tipo, se as vagas disponíveis
  // não vierem nos dados, reaproveita as atuais para não zerá-las. Se as vagas
  // totais vierem menores, a validação existente continua bloqueando.
  const manterVagasDisponiveis =
    dados.vagasDisponiveis === undefined &&
    atual.tipo === "Casa de Acolhimento" &&
    String(dados.tipo ?? "").trim() === "Casa de Acolhimento";

  // Preserva bairro/cep atuais quando não vierem nos dados (o formulário de
  // cadastro não coleta esses campos).
  const normalizado = validarDadosUnidade(
    {
      ...dados,
      bairro: dados.bairro !== undefined ? dados.bairro : atual.bairro,
      cep: dados.cep !== undefined ? dados.cep : atual.cep,
      vagasDisponiveis: manterVagasDisponiveis
        ? atual.vagasDisponiveis
        : dados.vagasDisponiveis,
    },
    { ignorarId: id },
  );

  const atualizada = {
    ...atual,
    nome: normalizado.nome,
    tipo: normalizado.tipo,
    endereco: normalizado.endereco,
    bairro: normalizado.bairro,
    cep: normalizado.cep,
    telefone: normalizado.telefone,
    horario: normalizado.horario,
  };

  if (normalizado.tipo === "Casa de Acolhimento") {
    atualizada.vagasTotal = normalizado.vagasTotal;
    atualizada.vagasDisponiveis = normalizado.vagasDisponiveis;
  } else {
    delete atualizada.vagasTotal;
    delete atualizada.vagasDisponiveis;
  }

  unidades[indice] = atualizada;

  return copiarUnidade(atualizada);
}

// Inativação de unidade (RF015). Suspende o atendimento sem apagar o
// registro, preservando o histórico para relatórios (RN003).
// Lança ErroUnidade ("UNIDADE_NAO_ENCONTRADA") se a unidade não existir.
export async function inativarUnidade(id) {
  const unidade = unidades.find((item) => item.id === id);

  if (!unidade) {
    throw new ErroUnidade(
      "UNIDADE_NAO_ENCONTRADA",
      MENSAGEM_UNIDADE_NAO_ENCONTRADA,
    );
  }

  unidade.ativa = false;

  return copiarUnidade(unidade);
}

// Exclusão de unidade (RF015, RN003). Bloqueia a remoção quando há
// encaminhamentos vinculados (totalEncaminhamentos > 0), orientando a
// inativar. Só remove quando não há histórico a preservar.
// Lança ErroUnidade ("UNIDADE_NAO_ENCONTRADA") se a unidade não existir.
export async function excluirUnidade(id) {
  const indice = unidades.findIndex((unidade) => unidade.id === id);

  if (indice === -1) {
    throw new ErroUnidade(
      "UNIDADE_NAO_ENCONTRADA",
      MENSAGEM_UNIDADE_NAO_ENCONTRADA,
    );
  }

  const unidade = unidades[indice];

  if (Number(unidade.totalEncaminhamentos) > 0) {
    throw new ErroUnidade(
      "UNIDADE_COM_ENCAMINHAMENTOS",
      MENSAGEM_UNIDADE_COM_ENCAMINHAMENTOS,
    );
  }

  unidades.splice(indice, 1);

  return { id };
}
