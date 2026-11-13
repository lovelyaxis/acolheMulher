require("dotenv").config();
const prisma = require("../src/config/prisma");

const BASE = "http://localhost:3000/api";
const EMAIL = "teste.auto@acolhemulher.com.br";
const SENHA = "SenhaTeste2026";
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
  await prisma.usuario.deleteMany({ where: { email: EMAIL } });
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
  const adminId = a.dados.usuario.id;
  const prof = p.dados.token;
  const profId = p.dados.usuario.id;

  const novo = {
    nome: "Profissional Teste",
    email: EMAIL,
    senha: SENHA,
    cargo: "Psicóloga"
  };

  // Acesso
  conferir("Lista sem token", (await chamar("GET", "/usuarios")).status, 401);
  conferir("Lista como profissional", (await chamar("GET", "/usuarios", prof)).status, 403);
  const lista = await chamar("GET", "/usuarios", admin);
  conferir("Lista como administrador", lista.status, 200);
  conferir(
    "Lista não mostra senhaHash",
    JSON.stringify(lista.dados).includes("senhaHash") ? "mostra" : "oculta",
    "oculta"
  );

  // Cadastro
  conferir("Profissional não cadastra", (await chamar("POST", "/usuarios", prof, novo)).status, 403);
  const criado = await chamar("POST", "/usuarios", admin, novo);
  conferir("Admin cadastra profissional", criado.status, 201);
  const id = criado.dados && criado.dados.id;
  if (!id) return;
  conferir(
    "Resposta do cadastro sem senhaHash",
    JSON.stringify(criado.dados).includes("senhaHash") ? "mostra" : "oculta",
    "oculta"
  );
  conferir("Perfil padrão é PROFISSIONAL", criado.dados.perfil, "PROFISSIONAL");
  conferir(
    "E-mail duplicado (maiúsculas)",
    (await chamar("POST", "/usuarios", admin, { ...novo, email: EMAIL.toUpperCase() })).status,
    409
  );
  conferir(
    "Senha curta",
    (await chamar("POST", "/usuarios", admin, { ...novo, email: "outro@teste.com", senha: "123" })).status,
    400
  );
  conferir(
    "E-mail inválido",
    (await chamar("POST", "/usuarios", admin, { ...novo, email: "semarroba" })).status,
    400
  );
  conferir(
    "Perfil inválido",
    (await chamar("POST", "/usuarios", admin, { ...novo, email: "outro@teste.com", perfil: "DONO" })).status,
    400
  );
  conferir(
    "Não cadastra administrador",
    (await chamar("POST", "/usuarios", admin, { ...novo, email: "novo-admin@teste.com", perfil: "ADMINISTRADOR" })).status,
    400
  );
  conferir(
    "Unidade inexistente",
    (await chamar("POST", "/usuarios", admin, { ...novo, email: "outro@teste.com", unidadeId: "nao-existe" })).status,
    400
  );

  // O novo usuário consegue entrar
  conferir(
    "Novo profissional faz login",
    (await chamar("POST", "/auth/login", null, { email: EMAIL, senha: SENHA })).status,
    200
  );

  // Consulta e edição
  conferir("Consulta um usuário", (await chamar("GET", `/usuarios/${id}`, admin)).status, 200);
  conferir(
    "Edita usuário",
    (await chamar("PUT", `/usuarios/${id}`, admin, { nome: "Profissional Editada", email: EMAIL, cargo: "Assistente social" })).status,
    200
  );
  conferir("Não busca administrador", (await chamar("GET", `/usuarios/${adminId}`, admin)).status, 404);
  conferir(
    "Não altera administrador",
    (await chamar("PUT", `/usuarios/${adminId}`, admin, { nome: "Maria Silva", email: "admin@acolhemulher.com.br" })).status,
    404
  );

  // Bloqueio e desbloqueio
  conferir("Bloqueia a conta", (await chamar("PATCH", `/usuarios/${id}/status`, admin, { ativo: false })).status, 200);
  conferir(
    "Conta bloqueada não entra",
    (await chamar("POST", "/auth/login", null, { email: EMAIL, senha: SENHA })).status,
    403
  );
  conferir("Desbloqueia a conta", (await chamar("PATCH", `/usuarios/${id}/status`, admin, { ativo: true })).status, 200);
  conferir(
    "Conta desbloqueada entra",
    (await chamar("POST", "/auth/login", null, { email: EMAIL, senha: SENHA })).status,
    200
  );
  conferir(
    "Não desativa administrador",
    (await chamar("PATCH", `/usuarios/${adminId}/status`, admin, { ativo: false })).status,
    404
  );

  // Exclusão
  conferir("Não exclui administrador", (await chamar("DELETE", `/usuarios/${adminId}`, admin)).status, 404);

  const comEnc = await prisma.encaminhamento.count({ where: { profissionalId: profId } });
  if (comEnc > 0) {
    conferir(
      "Bloqueia exclusão de quem tem encaminhamentos",
      (await chamar("DELETE", `/usuarios/${profId}`, admin)).status,
      409
    );
  } else {
    console.log("PULADO  A Ana não tem encaminhamentos, teste de exclusão vinculada ignorado");
  }

  conferir("Profissional não exclui", (await chamar("DELETE", `/usuarios/${id}`, prof)).status, 403);
  conferir("Admin exclui profissional sem vínculo", (await chamar("DELETE", `/usuarios/${id}`, admin)).status, 200);
  conferir("Consulta após excluir", (await chamar("GET", `/usuarios/${id}`, admin)).status, 404);
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