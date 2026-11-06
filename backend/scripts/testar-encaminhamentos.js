require("dotenv").config();
const prisma = require("../src/config/prisma");

const BASE = "http://localhost:3000/api";
const CODIGO = "TESTE-ENC-001";
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
  const carla = await login("carla@acolhemulher.com.br", "Acolhe2026!");
  const admin = await login("admin@acolhemulher.com.br", "Admin2026!");
  if (!ana || !carla || !admin) {
    console.log("Não consegui fazer login. O servidor está ligado?");
    falhas++;
    return;
  }

  const ativa = await prisma.unidade.findFirst({ where: { ativa: true } });
  const inativa = await prisma.unidade.findFirst({ where: { ativa: false } });
  if (!ativa) {
    console.log("Não há unidade ativa no banco. Rode o seed.");
    falhas++;
    return;
  }

  const novo = {
    codigoCaso: CODIGO,
    tipoAtendimento: "Apoio psicológico",
    unidadeDestinoId: ativa.id,
    observacoes: "Observação de teste",
    // O front antigo mandava isso. O servidor precisa ignorar.
    profissionalId: carla.id
  };

  // Acesso
  conferir("Cadastro sem token", (await chamar("POST", "/encaminhamentos", null, novo)).status, 401);
  conferir("Lista sem token", (await chamar("GET", "/encaminhamentos")).status, 401);
  conferir("Administrador não registra", (await chamar("POST", "/encaminhamentos", admin.token, novo)).status, 403);

  // Cadastro
  const criado = await chamar("POST", "/encaminhamentos", ana.token, novo);
  conferir("Profissional registra", criado.status, 201);
  const enc = criado.dados && criado.dados.encaminhamento;
  if (!enc) return;
  conferir(
    "Profissional vem do token (ignora o corpo)",
    enc.profissionalId === ana.id ? "token" : "corpo",
    "token"
  );
  conferir("Status inicial é PENDENTE", enc.status, "PENDENTE");

  conferir("Código duplicado", (await chamar("POST", "/encaminhamentos", ana.token, novo)).status, 409);
  conferir("Código curto", (await chamar("POST", "/encaminhamentos", ana.token, { ...novo, codigoCaso: "ab" })).status, 400);
  conferir("Rejeita nome", (await chamar("POST", "/encaminhamentos", ana.token, { ...novo, codigoCaso: "TESTE-ENC-002", nome: "Fulana" })).status, 400);
  conferir("Rejeita cpf", (await chamar("POST", "/encaminhamentos", ana.token, { ...novo, codigoCaso: "TESTE-ENC-002", cpf: "123" })).status, 400);
  conferir("Rejeita telefone", (await chamar("POST", "/encaminhamentos", ana.token, { ...novo, codigoCaso: "TESTE-ENC-002", telefone: "999" })).status, 400);
  conferir("Unidade inexistente", (await chamar("POST", "/encaminhamentos", ana.token, { ...novo, codigoCaso: "TESTE-ENC-002", unidadeDestinoId: "nao-existe" })).status, 400);
  if (inativa) {
    conferir("Unidade inativa", (await chamar("POST", "/encaminhamentos", ana.token, { ...novo, codigoCaso: "TESTE-ENC-002", unidadeDestinoId: inativa.id })).status, 400);
  } else {
    console.log("PULADO  Não há unidade inativa no banco");
  }
  conferir("Observações grandes demais", (await chamar("POST", "/encaminhamentos", ana.token, { ...novo, codigoCaso: "TESTE-ENC-002", observacoes: "x".repeat(1001) })).status, 400);

  // Consulta e permissões
  const listaAna = await chamar("GET", "/encaminhamentos", ana.token);
  conferir("Ana vê o encaminhamento", listaAna.dados.some(e => e.id === enc.id) ? "vê" : "não vê", "vê");
  conferir(
    "Ana vê só os dela",
    listaAna.dados.every(e => e.profissionalId === ana.id) ? "só os dela" : "vê de outros",
    "só os dela"
  );
  const listaCarla = await chamar("GET", "/encaminhamentos", carla.token);
  conferir("Carla não vê o da Ana", listaCarla.dados.some(e => e.id === enc.id) ? "vê" : "não vê", "não vê");
  const listaAdmin = await chamar("GET", "/encaminhamentos", admin.token);
  conferir("Admin vê todos", listaAdmin.dados.some(e => e.id === enc.id) ? "vê" : "não vê", "vê");

  conferir("Ana consulta o dela", (await chamar("GET", `/encaminhamentos/${enc.id}`, ana.token)).status, 200);
  conferir("Carla não consulta o da Ana", (await chamar("GET", `/encaminhamentos/${enc.id}`, carla.token)).status, 404);
  conferir("Admin consulta qualquer um", (await chamar("GET", `/encaminhamentos/${enc.id}`, admin.token)).status, 200);

  // Atualização de status
  conferir("Carla não altera o status", (await chamar("PATCH", `/encaminhamentos/${enc.id}/status`, carla.token, { status: "CONCLUIDO" })).status, 404);
  conferir("Status inválido", (await chamar("PATCH", `/encaminhamentos/${enc.id}/status`, ana.token, { status: "XYZ" })).status, 400);
  const atualizado = await chamar("PATCH", `/encaminhamentos/${enc.id}/status`, ana.token, { status: "CONCLUIDO" });
  conferir("Ana conclui o dela", atualizado.status, 200);
  conferir("Status virou CONCLUIDO", atualizado.dados && atualizado.dados.status, "CONCLUIDO");
  conferir("Observações preservadas", atualizado.dados && atualizado.dados.observacoes, "Observação de teste");
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