// Testes de integração da API AcolheMulher.
// Usam o banco de TESTE (.env.test), nunca o banco de demonstração.
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.test") });

// Proteção: recusa rodar fora de um banco de testes (os testes apagam dados).
const urlDoBanco = process.env.DATABASE_URL || "";
if (!/_teste(\?.*)?$/.test(urlDoBanco)) {
  throw new Error(
    "Os testes só rodam em um banco cujo nome termina em _teste. " +
      "Confira o DATABASE_URL do arquivo .env.test."
  );
}
process.env.JWT_SECRET = process.env.JWT_SECRET || "chave-somente-para-testes";

const { describe, it, before, after } = require("node:test");
const { once } = require("node:events");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");

const prisma = require("../prisma/client");
const app = require("../server");

const SENHA = "SenhaTeste2026";

let servidor;
let base;
let tokenAdmin;
let tokenProf;
let tokenProf2;
let profId;
let unidadeBaseId;
let unidadeInativaId;

async function chamar(metodo, caminho, { token, corpo } = {}) {
  const resposta = await fetch(base + caminho, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
  });
  let dados = null;
  try {
    dados = await resposta.json();
  } catch (erro) {
    // resposta sem corpo
  }
  return { status: resposta.status, dados };
}

async function limparBanco() {
  await prisma.encaminhamento.deleteMany();
  await prisma.orientacaoAnonima.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.unidade.deleteMany();
}

async function criarUsuario(nome, email, perfil) {
  return prisma.usuario.create({
    data: {
      nome,
      email,
      perfil,
      senhaHash: await bcrypt.hash(SENHA, 4),
      ativo: true,
      criadoEm: new Date(),
    },
  });
}

async function criarUnidade(nome, endereco, ativa) {
  return prisma.unidade.create({
    data: {
      nome,
      tipo: "DELEGACIA_MULHER",
      endereco,
      bairro: "Centro",
      cep: "11111-111",
      nomeNormalizado: nome.toLowerCase(),
      enderecoNormalizado: endereco.toLowerCase(),
      ativa,
      criadoEm: new Date(),
    },
  });
}

async function entrar(email, senha = SENHA) {
  return chamar("POST", "/api/auth/login", { corpo: { email, senha } });
}

before(async () => {
  await limparBanco();

  await criarUsuario("Admin Teste", "admin@teste.com", "ADMINISTRADOR");
  const prof = await criarUsuario("Profissional Teste", "prof@teste.com", "PROFISSIONAL");
  await criarUsuario("Profissional Dois", "prof2@teste.com", "PROFISSIONAL");
  profId = prof.id;

  unidadeBaseId = (await criarUnidade("Unidade Base", "Rua Base, 1", true)).id;
  unidadeInativaId = (await criarUnidade("Unidade Inativa", "Rua Inativa, 2", false)).id;

  servidor = app.listen(0);
  await once(servidor, "listening");
  base = `http://127.0.0.1:${servidor.address().port}`;

  tokenAdmin = (await entrar("admin@teste.com")).dados.token;
  tokenProf = (await entrar("prof@teste.com")).dados.token;
  tokenProf2 = (await entrar("prof2@teste.com")).dados.token;
});

after(async () => {
  await limparBanco();
  servidor.closeAllConnections();
  servidor.close();
  await prisma.$disconnect();
});

describe("Conexão com o banco", () => {
  it("consulta o MySQL de testes", async () => {
    const resultado = await prisma.$queryRaw`SELECT 1 AS ok`;
    assert.equal(Number(resultado[0].ok), 1);
  });

  it("a API responde", async () => {
    const r = await chamar("GET", "/api");
    assert.equal(r.status, 200);
  });
});

describe("Autenticação", () => {
  it("login válido devolve token e não devolve a senha", async () => {
    const r = await entrar("prof@teste.com");
    assert.equal(r.status, 200);
    assert.ok(r.dados.token);
    assert.equal(r.dados.usuario.perfil, "PROFISSIONAL");
    assert.equal(JSON.stringify(r.dados).includes("senhaHash"), false);
  });

  it("login com senha errada é recusado", async () => {
    const r = await entrar("prof@teste.com", "senha-errada");
    assert.equal(r.status, 401);
  });

  it("login com e-mail inexistente é recusado", async () => {
    const r = await entrar("naoexiste@teste.com");
    assert.equal(r.status, 401);
  });

  it("bloqueia a conta após cinco tentativas incorretas", async () => {
    await criarUsuario("Bloqueio", "bloqueio@teste.com", "PROFISSIONAL");

    for (let i = 1; i <= 4; i++) {
      const r = await entrar("bloqueio@teste.com", "errada");
      assert.equal(r.status, 401, `tentativa ${i}`);
    }

    const quinta = await entrar("bloqueio@teste.com", "errada");
    assert.equal(quinta.status, 429);

    // Mesmo com a senha certa, a conta continua bloqueada.
    const certa = await entrar("bloqueio@teste.com");
    assert.equal(certa.status, 429);
  });

  it("GET /api/auth/me devolve o usuário autenticado", async () => {
    const r = await chamar("GET", "/api/auth/me", { token: tokenProf });
    assert.equal(r.status, 200);
    assert.equal(r.dados.usuario.email, "prof@teste.com");
  });
});

describe("Proteção de rotas", () => {
  it("bloqueia acesso sem token", async () => {
    assert.equal((await chamar("GET", "/api/auth/me")).status, 401);
    assert.equal((await chamar("GET", "/api/encaminhamentos")).status, 401);
    assert.equal((await chamar("GET", "/api/usuarios")).status, 401);
    assert.equal((await chamar("GET", "/api/unidades/internas")).status, 401);
  });

  it("bloqueia token inválido", async () => {
    const r = await chamar("GET", "/api/auth/me", { token: "token.invalido" });
    assert.equal(r.status, 401);
  });

  it("bloqueia perfil inadequado", async () => {
    // Profissional tentando ações de administrador
    assert.equal((await chamar("GET", "/api/usuarios", { token: tokenProf })).status, 403);
    assert.equal(
      (await chamar("POST", "/api/unidades", { token: tokenProf, corpo: {} })).status,
      403
    );
    // Administrador tentando registrar encaminhamento
    assert.equal(
      (await chamar("POST", "/api/encaminhamentos", { token: tokenAdmin, corpo: {} })).status,
      403
    );
    // Profissional no dashboard do administrador
    assert.equal((await chamar("GET", "/api/dashboard/admin", { token: tokenProf })).status, 403);
  });
});

describe("Unidades", () => {
  let unidadeId;
  const nova = {
    nome: "Casa Teste",
    tipo: "CASA_ACOLHIMENTO",
    endereco: "Rua dos Testes, 10",
    bairro: "Centro",
    cep: "12345-678",
    telefone: "(11) 4000-0000",
    horario: "24 horas",
    vagasTotal: 10,
    vagasDisponiveis: 4,
  };

  it("administrador cadastra unidade", async () => {
    const r = await chamar("POST", "/api/unidades", { token: tokenAdmin, corpo: nova });
    assert.equal(r.status, 201);
    assert.ok(r.dados.id);
    unidadeId = r.dados.id;
  });

  it("RN004: impede unidade duplicada (nome e endereço)", async () => {
    const r = await chamar("POST", "/api/unidades", {
      token: tokenAdmin,
      corpo: { ...nova, nome: "  casa TESTE ", endereco: "rua dos testes, 10" },
    });
    assert.equal(r.status, 409);
  });

  it("impede vagas disponíveis maiores que o total", async () => {
    const r = await chamar("POST", "/api/unidades", {
      token: tokenAdmin,
      corpo: { ...nova, nome: "Outra Casa", endereco: "Rua B, 2", vagasDisponiveis: 99 },
    });
    assert.equal(r.status, 400);
  });

  it("valida o tipo de unidade", async () => {
    const r = await chamar("POST", "/api/unidades", {
      token: tokenAdmin,
      corpo: { ...nova, nome: "Outra", endereco: "Rua C, 3", tipo: "XYZ" },
    });
    assert.equal(r.status, 400);
  });

  it("consulta pública não mostra vagas", async () => {
    const r = await chamar("GET", "/api/unidades");
    assert.equal(r.status, 200);
    assert.ok(r.dados.some((u) => u.id === unidadeId));
    assert.equal(r.dados.some((u) => "vagasTotal" in u), false);
  });

  it("consulta interna mostra vagas", async () => {
    const r = await chamar("GET", "/api/unidades/internas", { token: tokenProf });
    assert.equal(r.status, 200);
    const casa = r.dados.find((u) => u.id === unidadeId);
    assert.equal(casa.vagasTotal, 10);
    assert.equal(casa.vagasDisponiveis, 4);
  });

  it("consulta uma unidade", async () => {
    const r = await chamar("GET", `/api/unidades/${unidadeId}`, { token: tokenProf });
    assert.equal(r.status, 200);
    assert.equal(r.dados.nome, "Casa Teste");
  });

  it("administrador edita unidade", async () => {
    const r = await chamar("PUT", `/api/unidades/${unidadeId}`, {
      token: tokenAdmin,
      corpo: { ...nova, horario: "08h às 18h" },
    });
    assert.equal(r.status, 200);
    assert.equal(r.dados.horario, "08h às 18h");
  });

  it("RN003: bloqueia exclusão de unidade com encaminhamentos", async () => {
    await prisma.encaminhamento.create({
      data: {
        codigoCaso: "VINCULO-001",
        tipoAtendimento: "Teste",
        unidadeDestinoId: unidadeId,
        profissionalId: profId,
        criadoEm: new Date(),
      },
    });

    const r = await chamar("DELETE", `/api/unidades/${unidadeId}`, { token: tokenAdmin });
    assert.equal(r.status, 409);
  });

  it("administrador inativa unidade", async () => {
    const r = await chamar("PATCH", `/api/unidades/${unidadeId}/inativar`, {
      token: tokenAdmin,
    });
    assert.equal(r.status, 200);
    assert.equal(r.dados.ativa, false);

    const publica = await chamar("GET", "/api/unidades");
    assert.equal(publica.dados.some((u) => u.id === unidadeId), false);
  });

  it("exclui unidade sem encaminhamentos", async () => {
    const criada = await chamar("POST", "/api/unidades", {
      token: tokenAdmin,
      corpo: { ...nova, nome: "Descartavel", endereco: "Rua D, 4" },
    });
    assert.equal(criada.status, 201);

    const r = await chamar("DELETE", `/api/unidades/${criada.dados.id}`, { token: tokenAdmin });
    assert.equal(r.status, 200);

    const depois = await chamar("GET", `/api/unidades/${criada.dados.id}`, { token: tokenAdmin });
    assert.equal(depois.status, 404);
  });
});

describe("Profissionais", () => {
  it("administrador cadastra profissional (senha com hash, sem devolvê-la)", async () => {
    const r = await chamar("POST", "/api/usuarios", {
      token: tokenAdmin,
      corpo: {
        nome: "Nova Profissional",
        email: "nova@teste.com",
        senha: SENHA,
        cargo: "Psicóloga",
      },
    });
    assert.equal(r.status, 201);
    assert.equal(r.dados.perfil, "PROFISSIONAL");
    assert.equal(JSON.stringify(r.dados).includes("senhaHash"), false);

    const noBanco = await prisma.usuario.findUnique({ where: { email: "nova@teste.com" } });
    assert.notEqual(noBanco.senhaHash, SENHA);
    assert.ok(noBanco.senhaHash.startsWith("$2"));
  });

  it("impede e-mail duplicado", async () => {
    const r = await chamar("POST", "/api/usuarios", {
      token: tokenAdmin,
      corpo: { nome: "Outra", email: "NOVA@teste.com", senha: SENHA },
    });
    assert.equal(r.status, 409);
  });

  it("a nova profissional consegue entrar", async () => {
    const r = await entrar("nova@teste.com");
    assert.equal(r.status, 200);
  });
});

describe("Encaminhamentos", () => {
  let encaminhamentoId;

  it("profissional registra encaminhamento (identificado pelo token)", async () => {
    const r = await chamar("POST", "/api/encaminhamentos", {
      token: tokenProf,
      corpo: {
        codigoCaso: "CASO-001",
        tipoAtendimento: "Apoio psicológico",
        unidadeDestinoId: unidadeBaseId,
        observacoes: "Observação de teste",
        profissionalId: "id-de-outra-pessoa", // deve ser ignorado
      },
    });
    assert.equal(r.status, 201);
    assert.equal(r.dados.encaminhamento.profissionalId, profId);
    assert.equal(r.dados.encaminhamento.status, "PENDENTE");
    encaminhamentoId = r.dados.encaminhamento.id;
  });

  it("impede código de caso repetido", async () => {
    const r = await chamar("POST", "/api/encaminhamentos", {
      token: tokenProf,
      corpo: {
        codigoCaso: "CASO-001",
        tipoAtendimento: "Teste",
        unidadeDestinoId: unidadeBaseId,
      },
    });
    assert.equal(r.status, 409);
  });

  it("rejeita nome, CPF e telefone da pessoa atendida", async () => {
    for (const campo of ["nome", "cpf", "telefone"]) {
      const r = await chamar("POST", "/api/encaminhamentos", {
        token: tokenProf,
        corpo: {
          codigoCaso: `CASO-${campo}`,
          tipoAtendimento: "Teste",
          unidadeDestinoId: unidadeBaseId,
          [campo]: "dado pessoal",
        },
      });
      assert.equal(r.status, 400, campo);
    }
  });

  it("não permite encaminhar para unidade inativa", async () => {
    const r = await chamar("POST", "/api/encaminhamentos", {
      token: tokenProf,
      corpo: {
        codigoCaso: "CASO-INATIVA",
        tipoAtendimento: "Teste",
        unidadeDestinoId: unidadeInativaId,
      },
    });
    assert.equal(r.status, 400);
  });

  it("profissional consulta os seus encaminhamentos", async () => {
    const lista = await chamar("GET", "/api/encaminhamentos", { token: tokenProf });
    assert.equal(lista.status, 200);
    assert.ok(lista.dados.some((e) => e.id === encaminhamentoId));

    const um = await chamar("GET", `/api/encaminhamentos/${encaminhamentoId}`, { token: tokenProf });
    assert.equal(um.status, 200);
  });

  it("outro profissional não enxerga o encaminhamento", async () => {
    const lista = await chamar("GET", "/api/encaminhamentos", { token: tokenProf2 });
    assert.equal(lista.dados.some((e) => e.id === encaminhamentoId), false);

    const um = await chamar("GET", `/api/encaminhamentos/${encaminhamentoId}`, { token: tokenProf2 });
    assert.equal(um.status, 404);
  });

  it("atualiza o status e preserva as observações", async () => {
    const invalido = await chamar("PATCH", `/api/encaminhamentos/${encaminhamentoId}/status`, {
      token: tokenProf,
      corpo: { status: "XYZ" },
    });
    assert.equal(invalido.status, 400);

    const r = await chamar("PATCH", `/api/encaminhamentos/${encaminhamentoId}/status`, {
      token: tokenProf,
      corpo: { status: "CONCLUIDO" },
    });
    assert.equal(r.status, 200);
    assert.equal(r.dados.status, "CONCLUIDO");
    assert.equal(r.dados.observacoes, "Observação de teste");
  });
});

describe("Orientações anônimas", () => {
  it("recebe a mensagem sem exigir login e grava só mensagem e categoria", async () => {
    const r = await chamar("POST", "/api/orientacoes-anonimas", {
      corpo: {
        mensagem: "Preciso de orientação",
        categoria: "direitos",
        nome: "Não deve ser salvo",
        email: "naosalvar@teste.com",
      },
    });
    assert.equal(r.status, 201);

    const gravada = await prisma.orientacaoAnonima.findFirst();
    assert.equal(
      Object.keys(gravada).sort().join(","),
      "categoria,criadoEm,id,mensagem"
    );
    assert.equal(JSON.stringify(gravada).includes("naosalvar"), false);
  });

  it("valida mensagem e categoria", async () => {
    const semMensagem = await chamar("POST", "/api/orientacoes-anonimas", {
      corpo: { mensagem: "   ", categoria: "direitos" },
    });
    assert.equal(semMensagem.status, 400);

    const grande = await chamar("POST", "/api/orientacoes-anonimas", {
      corpo: { mensagem: "x".repeat(2001), categoria: "direitos" },
    });
    assert.equal(grande.status, 400);

    const categoria = await chamar("POST", "/api/orientacoes-anonimas", {
      corpo: { mensagem: "Olá", categoria: "xyz" },
    });
    assert.equal(categoria.status, 400);
  });
});