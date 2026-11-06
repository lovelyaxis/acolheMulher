const prisma = require("../config/prisma");
const { inicioDoDia, inicioDoMes } = require("../utils/datas");

// GET /api/dashboard/profissional
async function profissional(req, res) {
  try {
    const meus = { profissionalId: req.usuario.id };

    const [total, pendentes, concluidos, hoje] = await Promise.all([
      prisma.encaminhamento.count({ where: meus }),
      prisma.encaminhamento.count({ where: { ...meus, status: "PENDENTE" } }),
      prisma.encaminhamento.count({ where: { ...meus, status: "CONCLUIDO" } }),
      prisma.encaminhamento.count({
        where: { ...meus, criadoEm: { gte: inicioDoDia() } }
      })
    ]);

    return res.status(200).json({
      totalEncaminhamentos: total,
      encaminhamentosPendentes: pendentes,
      encaminhamentosConcluidos: concluidos,
      atendimentosHoje: hoje
    });
  } catch (erro) {
    console.error("Erro no dashboard do profissional:", erro.message);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
}

// GET /api/dashboard/admin
async function admin(req, res) {
  try {
    const [unidades, profissionais, atendimentosMes] = await Promise.all([
      prisma.unidade.count(),
      prisma.usuario.count({
        where: { perfil: "PROFISSIONAL", ativo: true }
      }),
      prisma.encaminhamento.count({
        where: { criadoEm: { gte: inicioDoMes() } }
      })
    ]);

    return res.status(200).json({
      totalUnidades: unidades,
      profissionaisAtivos: profissionais,
      atendimentosMes
    });
  } catch (erro) {
    console.error("Erro no dashboard administrativo:", erro.message);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
}

module.exports = { profissional, admin };