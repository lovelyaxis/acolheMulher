import { api } from "./api";

export async function listarProfissionais() {
  const resposta = await api.get("/usuarios");
  if (Array.isArray(resposta)) return resposta;
  return resposta?.usuarios || resposta?.dados || [];
}

export async function buscarProfissionalPorId(id) {
  return api.get(`/usuarios/${encodeURIComponent(id)}`);
}

export async function cadastrarProfissional(dados) {
  return api.post("/usuarios", { ...dados, perfil: "PROFISSIONAL" });
}

export async function editarProfissional(id, dados) {
  return api.put(`/usuarios/${encodeURIComponent(id)}`, dados);
}

export async function alterarStatusProfissional(id, ativo) {
  return api.patch(`/usuarios/${encodeURIComponent(id)}/status`, { ativo });
}

export async function excluirProfissional(id) {
  return api.delete(`/usuarios/${encodeURIComponent(id)}`);
}
