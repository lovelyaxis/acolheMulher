require("dotenv").config();
const prisma = require("../src/config/prisma");

const BASE = "http://localhost:3000/api";
const NOME = "Unidade Teste Automatico";
const CODIGO = "TESTE-AUTO-001";
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

async function limpar() {
  await prisma.encaminhamento.deleteMany({ where: { codigoCaso: CODIGO } });
  await prisma.unidade.deleteMany({ where: { nome: NOME } });
}

async function main() {
  await limpar();

  const a = await chamar("POST", "/auth/login", null, {
    email: "admin@acolhemulher.com.br",
    senha: "Admin2026!"
  });
  const p = await chamar("POST", "/auth/login", null, {
    email: "ana@acolhemulher.com.br",
    senha: "Acolhe2026!"
  });
  if (!a.dados || !a.dados.token || !p.dados || !p.dados.token) {
    console.log("Não consegui fazer login. O servidor está ligado?");
    falhas++;
    return;
  }
  const admin = a.dados.token;
  const prof = p.dados.token;
  const profId = p.dados.usuario.id;

  const nova = {
    nome: NOME,
    tipo: "CASA_ACOLHIMENTO",
    endereco: "Rua dos Testes, 100",
    bairro: "Centro",
    cep: "12345-678",
    telefone: "(11) 4000-0000",
    horario: "24 horas",
    vagasTotal: 10,
    vagasDisponiveis: 4
  };

  // Consulta pública e interna
  const pub = await chamar("GET", "/unidades");
  conferir("Lista pública", pub.status, 200);
  conferir(
    "Lista pública não mostra vagas",
    pub.dados.some(u => "vagasTotal" in u) ? "mostra" : "oculta",
    "oculta"
  );
  conferir(
    "Internas sem token",
    (await chamar("GET", "/unidades/internas")).status,
    401
  );
  const interna = await chamar("GET", "/unidades/internas", prof);
  conferir("Internas como profissional", interna.status, 200);
  conferir(
    "Internas mostram vagas",
    interna.dados.some(u => u.vagasTotal != null) ? "mostra" : "oculta",
    "mostra"
  );

  // Cadastro
  conferir(
    "Profissional não cadastra",
    (await chamar("POST", "/unidades", prof, nova)).status,
    403
  );
  conferir(
    "Cadastro sem token",
    (await chamar("POST", "/unidades", null, nova)).status,
    401
  );
  const criada = await chamar("POST", "/unidades", admin, nova);
  conferir("Admin cadastra unidade", criada.status, 201);
  const id = criada.dados && criada.dados.id;
  if (!id) return;

  conferir(
    "Duplicada é bloqueada",
    (await chamar("POST", "/unidades", admin, { ...nova, nome: "  unidade TESTE automático " })).status,
    409
  );
  conferir(
    "Vagas disponíveis maiores que o total",
    (await chamar("POST", "/unidades", admin, { ...nova, nome: "Outra", endereco: "Rua B, 2", vagasDisponiveis: 99 })).status,
    400
  );
  conferir(
    "Tipo inválido",
    (await chamar("POST", "/unidades", admin, { ...nova, nome: "Outra", endereco: "Rua B, 2", tipo: "XYZ" })).status,
    400
  );

  // Consulta, edição, inativação
  conferir("Consulta uma unidade", (await chamar("GET", `/unidades/${id}`, prof)).status, 200);
  conferir(
    "Edita unidade",
    (await chamar("PUT", `/unidades/${id}`, admin, { ...nova, horario: "08h às 18h" })).status,
    200
  );
  conferir(
    "Profissional não edita",
    (await chamar("PUT", `/unidades/${id}`, prof, nova)).status,
    403
  );
  conferir("Inativa unidade", (await chamar("PATCH", `/unidades/${id}/inativar`, admin)).status, 200);
  const pub2 = await chamar("GET", "/unidades");
  conferir(
    "Inativa some da lista pública",
    pub2.dados.some(u => u.id === id) ? "aparece" : "some",
    "some"
  );

  // Exclusão com encaminhamento vinculado
  await prisma.encaminhamento.create({
    data: {
      codigoCaso: CODIGO,
      tipoAtendimento: "Teste",
      unidadeDestinoId: id,
      profissionalId: profId,
      criadoEm: new Date()
    }
  });
  conferir(
    "Bloqueia exclusão com encaminhamento",
    (await chamar("DELETE", `/unidades/${id}`, admin)).status,
    409
  );
  await prisma.encaminhamento.deleteMany({ where: { codigoCaso: CODIGO } });

  conferir(
    "Profissional não exclui",
    (await chamar("DELETE", `/unidades/${id}`, prof)).status,
    403
  );
  conferir("Admin exclui", (await chamar("DELETE", `/unidades/${id}`, admin)).status, 200);
  conferir("Consulta após excluir", (await chamar("GET", `/unidades/${id}`, admin)).status, 404);
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