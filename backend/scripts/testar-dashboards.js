require("dotenv").config();
const prisma = require("../src/config/prisma");
const { inicioDoMes } = require("../src/utils/datas");

const BASE = "http://localhost:3000/api";
const CODIGO = "TESTE-DASH-001";
let falhas = 0;

async function chamar(metodo, caminho, token, corpo) {
  const resposta = await fetch(BASE + caminho, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: corpo ? JSON.stringify(corpo) : undefined
  });
  let dados = null;
  try {
    dados = await resposta.json();
  } catch (e) {}
  return { status: resposta.status, dados };
}

function conferir(descricao, obtido, esperado) {
  const ok = obtido === esperado;
  if (!ok) falhas++;
  console.log(
    `${ok ? "OK     " : "FALHOU "} ${descricao} (esperado ${esperado}, veio ${obtido})`
  );
}

async function login(email, senha) {
  const r = await chamar("POST", "/auth/login", null, { email, senha });
  return r.dados && r.dados.token
    ? { token: r.dados.token, id: r.dados.usuario.id }
    : null;
}

async function limpar() {
  await prisma.encaminhamento.deleteMany({ where: { codigoCaso: CODIGO } });
}

async function main() {
  await limpar();

  const ana = await login("ana@acolhemulher.com.br", "Acolhe2026!");
  const admin = await login("admin@acolhemulher.com.br", "Admin2026!");
  if (!ana || !admin) {
    console.log("Não consegui fazer login. O servidor está ligado?");
    falhas++;
    return;
  }

  // Acesso
  conferir("Profissional sem token", (await chamar("GET", "/dashboard/profissional")).status, 401);
  conferir("Admin sem token", (await chamar("GET", "/dashboard/admin")).status, 401);
  conferir("Admin na rota do profissional", (await chamar("GET", "/dashboard/profissional", admin.token)).status, 403);
  conferir("Profissional na rota do admin", (await chamar("GET", "/dashboard/admin", ana.token)).status, 403);

  // Dashboard do profissional: números batem com o banco
  const antes = await chamar("GET", "/dashboard/profissional", ana.token);
  conferir("Dashboard do profissional", antes.status, 200);
  const a = antes.dados;
  conferir(
    "Total bate com o banco",
    a.totalEncaminhamentos,
    await prisma.encaminhamento.count({ where: { profissionalId: ana.id } })
  );
  conferir("Total = pendentes + concluídos", a.encaminhamentosPendentes + a.encaminhamentosConcluidos, a.totalEncaminhamentos);

  // Registrar um encaminhamento muda os números
  const unidade = await prisma.unidade.findFirst({ where: { ativa: true } });
  const criado = await chamar("POST", "/encaminhamentos", ana.token, {
    codigoCaso: CODIGO,
    tipoAtendimento: "Teste dashboard",
    unidadeDestinoId: unidade.id,
    observacoes: "teste"
  });
  conferir("Registra encaminhamento", criado.status, 201);
  const id = criado.dados.encaminhamento.id;

  const depois = (await chamar("GET", "/dashboard/profissional", ana.token)).dados;
  conferir("Total aumentou 1", depois.totalEncaminhamentos, a.totalEncaminhamentos + 1);
  conferir("Pendentes aumentou 1", depois.encaminhamentosPendentes, a.encaminhamentosPendentes + 1);
  conferir("Atendimentos de hoje aumentou 1", depois.atendimentosHoje, a.atendimentosHoje + 1);

  await chamar("PATCH", `/encaminhamentos/${id}/status`, ana.token, { status: "CONCLUIDO" });
  const concluido = (await chamar("GET", "/dashboard/profissional", ana.token)).dados;
  conferir("Pendentes voltou ao valor anterior", concluido.encaminhamentosPendentes, a.encaminhamentosPendentes);
  conferir("Concluídos aumentou 1", concluido.encaminhamentosConcluidos, a.encaminhamentosConcluidos + 1);

  // Dashboard administrativo: números batem com o banco
  const adm = await chamar("GET", "/dashboard/admin", admin.token);
  conferir("Dashboard administrativo", adm.status, 200);
  conferir("Total de unidades", adm.dados.totalUnidades, await prisma.unidade.count());
  conferir(
    "Profissionais ativos",
    adm.dados.profissionaisAtivos,
    await prisma.usuario.count({ where: { perfil: "PROFISSIONAL", ativo: true } })
  );
  conferir(
    "Atendimentos do mês",
    adm.dados.atendimentosMes,
    await prisma.encaminhamento.count({ where: { criadoEm: { gte: inicioDoMes() } } })
  );
}

main()
  .catch(e => {
    console.error("Erro no teste:", e.message);
    falhas++;
  })
  .finally(async () => {
    await limpar().catch(() => {});
    await prisma.$disconnect();
    console.log(falhas === 0 ? "\nTUDO CERTO" : `\n${falhas} teste(s) falharam`);
  });