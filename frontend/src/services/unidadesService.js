// Serviço de unidades de atendimento.
// Único ponto do projeto que acessa o mock; as páginas usam apenas estas
// funções, para que a troca por chamadas reais seja feita aqui depois.
//
// Observação (RF003 x RF012): as funções públicas listarUnidades e
// buscarUnidades nunca devolvem dados de vagas. A visão interna usa
// listarUnidadesInternas, que devolve vagasTotal e vagasDisponiveis.
// Numa API real, essa separação também precisa ser garantida no servidor.

import { unidades } from "../mocks/unidades.js";

// A lista de tipos é reexportada aqui para que as telas importem apenas
// deste serviço e nunca acessem o mock diretamente (AGENTS.md).
export { TIPOS_UNIDADE } from "../mocks/unidades.js";

const normalizarTexto = (valor = "") =>
  String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const apenasDigitos = (valor = "") => String(valor).replace(/\D/g, "");

const copiarUnidade = (unidade) => ({ ...unidade });

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
