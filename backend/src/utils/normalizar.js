// Padroniza texto para comparar duplicidade:
// sem acentos, minúsculo e sem espaços repetidos.
function normalizarTexto(valor) {
  return String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = { normalizarTexto };