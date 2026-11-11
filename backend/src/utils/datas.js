// Brasília está em UTC-3 (sem horário de verão).
const DESLOCAMENTO_MS = 3 * 60 * 60 * 1000;

// Instante em que o dia de hoje (no horário de Brasília) começou.
function inicioDoDia(agora = new Date()) {
  const deslocada = new Date(agora.getTime() - DESLOCAMENTO_MS);
  deslocada.setUTCHours(0, 0, 0, 0);
  return new Date(deslocada.getTime() + DESLOCAMENTO_MS);
}

// Instante em que o mês atual (no horário de Brasília) começou.
function inicioDoMes(agora = new Date()) {
  const deslocada = new Date(agora.getTime() - DESLOCAMENTO_MS);
  return new Date(
    Date.UTC(deslocada.getUTCFullYear(), deslocada.getUTCMonth(), 1, 3, 0, 0)
  );
}

module.exports = { inicioDoDia, inicioDoMes };