/**
 * Usuários simulados do sistema AcolheMulher.
 *
 * ATENÇÃO: este é um MOCK temporário, usado enquanto o back-end não está
 * definido (veja AGENTS.md). As senhas já estão armazenadas com hash
 * SHA-256, nunca em texto puro (RNF001). Substitua este arquivo por chamadas
 * reais à API quando o back-end estiver pronto.
 *
 * Credenciais de teste (apenas para ambiente acadêmico/demonstração):
 *  - Profissional: ana@acolhemulher.com.br / Acolhe2026!
 *  - Administrador: admin@acolhemulher.com.br / Admin2026!
 */
export const USUARIOS = [
  {
    id: "prof-001",
    nome: "Ana Paula",
    email: "ana@acolhemulher.com.br",
    perfil: "PROFISSIONAL",
    unidade: "CRAS Centro",
    cargo: "Assistente Social",
    // hash SHA-256 de "Acolhe2026!"
    senhaHash:
      "6e4be18a22e2bb77150e9c5139938b9a7b9c3d39590effb14b0bd4791dc9f148",
  },
  {
    id: "adm-001",
    nome: "Maria Silva",
    email: "admin@acolhemulher.com.br",
    perfil: "ADMINISTRADOR",
    unidade: null,
    cargo: "Gestora do sistema",
    // hash SHA-256 de "Admin2026!"
    senhaHash:
      "04445e6487736590d1ef50186b414e737e0164683cbbec64e00e73c000fd3bef",
  },
];

export function buscarUsuarioPorEmail(email) {
  return USUARIOS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
