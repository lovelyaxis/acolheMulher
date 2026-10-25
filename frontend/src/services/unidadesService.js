// Serviço de unidades de atendimento.
// Único ponto do projeto que acessa o mock; as páginas usam apenas estas
// funções, para que a troca por chamadas reais seja feita aqui depois.
//
// Observação (RF003 x RF012): o serviço devolve todos os campos, inclusive
// `vagas`. Esconder as vagas na consulta pública e mostrá-las na consulta
// interna é responsabilidade da tela, que conhece o perfil conectado.

import { unidades } from "../mocks/unidades.js";

const normalizarTexto = (valor = "") =>
  String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const apenasDigitos = (valor = "") => String(valor).replace(/\D/g, "");

const copiarUnidade = (unidade) => ({ ...unidade });

export async function listarUnidades({ incluirInativas = false } = {}) {
  return unidades
    .filter((unidade) => incluirInativas || unidade.ativa)
    .map(copiarUnidade);
}

export async function buscarUnidades({ termo = "", tipo } = {}) {
  const termoTexto = normalizarTexto(termo);
  const termoDigitos = apenasDigitos(termo);
  const compararCep = termoDigitos.length > 0;
  const tipoNormalizado = normalizarTexto(tipo);

  return unidades
    .filter((unidade) => unidade.ativa)
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
    })
    .map(copiarUnidade);
}
