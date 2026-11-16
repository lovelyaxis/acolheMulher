import { api } from "./api";

// O banco usa PENDENTE / CONCLUIDO; a tela mostra "Pendente" / "Concluído".
const STATUS_EXIBICAO = {
  PENDENTE: "Pendente",
  CONCLUIDO: "Concluído",
};

function converterEncaminhamento(item) {
  return {
    id: item.id,
    codigo: item.codigoCaso,
    servico: item.tipoAtendimento,
    destino: item.unidadeDestino
      ? item.unidadeDestino.nome
      : "Unidade não identificada",
    unidadeDestinoId: item.unidadeDestinoId,
    data: item.criadoEm
      ? new Date(item.criadoEm).toLocaleDateString("pt-BR")
      : "",
    status: STATUS_EXIBICAO[item.status] || item.status,
    statusCodigo: item.status,
    observacoes: item.observacoes || "",
  };
}

// Lista os encaminhamentos do profissional logado (o servidor usa o token).
export async function listarEncaminhamentos(status) {
  const parametros = new URLSearchParams();
  if (status) parametros.set("status", status);
  const consulta = parametros.toString();
  const lista = await api.get(
    `/encaminhamentos${consulta ? `?${consulta}` : ""}`,
  );
  return lista.map(converterEncaminhamento);
}

// Registra um encaminhamento. O profissional vem do token, no servidor.
export async function registrarEncaminhamento({
  codigoCaso,
  tipoAtendimento,
  unidadeDestinoId,
  observacoes,
}) {
  const dados = await api.post("/encaminhamentos", {
    codigoCaso,
    tipoAtendimento,
    unidadeDestinoId,
    observacoes,
  });
  return converterEncaminhamento(dados.encaminhamento);
}

// Atualiza a situação: "PENDENTE" ou "CONCLUIDO".
export async function atualizarStatusEncaminhamento(id, status) {
  const dados = await api.patch(`/encaminhamentos/${id}/status`, { status });
  return converterEncaminhamento(dados);
}

// Unidades ativas para escolher o destino (consulta pública, sem vagas).
export async function listarUnidadesDestino() {
  return api.get("/unidades", { autenticado: false });
}