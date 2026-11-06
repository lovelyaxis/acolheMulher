
const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("../server");

test("API AcolheMulher", async (t) => {
  const server = app.listen(0);

  await new Promise((resolve) => {
    server.once("listening", resolve);
  });

  const endereco = server.address();
  const baseUrl = `http://127.0.0.1:${endereco.port}`;

  t.after(() => {
    server.close();
  });

  // Variáveis compartilhadas entre os testes
  let token = null;
  let unidadeId = null;

  // Faz login como profissional para obter token (só profissionais cadastram encaminhamentos)
  await t.test("login profissional obtém token JWT", async () => {
    const resposta = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "ana@acolhemulher.com.br",
        senha: "Acolhe2026!",
      }),
    });

    assert.equal(resposta.status, 200);
    const dados = await resposta.json();
    assert.ok(dados.token, "Token deve ser retornado");
    token = dados.token;
  });

  // Obtém uma unidade válida do banco
  await t.test("obter unidade válida para testes", async () => {
    const resposta = await fetch(`${baseUrl}/api/unidades`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    assert.equal(resposta.status, 200);
    const unidades = await resposta.json();
    assert.ok(unidades.length > 0, "Deve existir pelo menos uma unidade");
    unidadeId = unidades[0].id;
  });

  await t.test("GET /api retorna 200", async () => {
    const resposta = await fetch(`${baseUrl}/api`);
    const dados = await resposta.json();

    assert.equal(resposta.status, 200);
    assert.equal(
      dados.mensagem,
      "API AcolheMulher funcionando."
    );
  });

  await t.test(
    "canal anônimo aceita mensagem sem dados pessoais",
    async () => {
      const resposta = await fetch(
        `${baseUrl}/api/orientacoes-anonimas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mensagem: "Mensagem fictícia de teste.",
            categoria: "direitos"
          })
        }
      );

      assert.equal(resposta.status, 201);
    }
  );

  await t.test(
    "canal anônimo rejeita mensagem vazia",
    async () => {
      const resposta = await fetch(
        `${baseUrl}/api/orientacoes-anonimas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mensagem: "   ",
            categoria: "direitos"
          })
        }
      );

      assert.equal(resposta.status, 400);
    }
  );

  await t.test(
    "encaminhamento válido é registrado",
    async () => {
      const codigoCaso = `TESTE-${Date.now()}`;
      const resposta = await fetch(
        `${baseUrl}/api/encaminhamentos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            codigoCaso,
            tipoAtendimento: "Acolhimento social",
            unidadeDestinoId: unidadeId,
            observacoes: "Registro fictício de teste."
          })
        }
      );

      assert.equal(resposta.status, 201);

      const dados = await resposta.json();
      assert.equal(
        dados.encaminhamento.codigoCaso,
        codigoCaso
      );
      assert.equal(
        dados.encaminhamento.status,
        "PENDENTE"
      );
      assert.equal(
        Object.hasOwn(dados.encaminhamento, "nome"),
        false
      );
    }
  );

  await t.test(
    "encaminhamento com nome é rejeitado",
    async () => {
      const resposta = await fetch(
        `${baseUrl}/api/encaminhamentos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            codigoCaso: `TESTE-${Date.now()}`,
            nome: "Pessoa Fictícia",
            tipoAtendimento: "Acolhimento social",
            unidadeDestinoId: unidadeId,
            observacoes: "Teste de validação."
          })
        }
      );

      assert.equal(resposta.status, 400);
    }
  );

  await t.test(
    "dashboard retorna indicadores",
    async () => {
      const resposta = await fetch(
        `${baseUrl}/api/dashboard/profissional`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const dados = await resposta.json();

      assert.equal(resposta.status, 200);
      assert.equal(typeof dados.totalEncaminhamentos, "number");
      assert.equal(typeof dados.encaminhamentosPendentes, "number");
      assert.equal(typeof dados.encaminhamentosConcluidos, "number");
      assert.equal(typeof dados.atendimentosHoje, "number");
    }
  );
});
