import { api } from "./api";

function converterOcorrencia(item) {
  return {
    id: item.id,
    tipoEvento: item.tipoEvento,
    observacoes: item.observacoes || "",
    criadoEm: item.criadoEm
      ? new Date(item.criadoEm).toLocaleString("pt-BR")
      : "",
    criadoPor: item.profissional?.nome || "—",
  };
}

// Lista as ocorrências registradas (mais recentes primeiro).
export async function listarOcorrencias() {
  const dados = await api.get("/ocorrencias");
  const lista = dados?.ocorrencias ?? [];
  return Array.isArray(lista) ? lista.map(converterOcorrencia) : [];
}

// Registra uma nova ocorrência.
export async function registrarOcorrencia({ tipoEvento, observacoes }) {
  const dados = await api.post("/ocorrencias", {
    tipoEvento,
    observacoes,
  });
  return converterOcorrencia(dados.ocorrencia ?? dados);
}
