
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
      const resposta = await fetch(
        `${baseUrl}/api/encaminhamentos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            codigoCaso: "TESTE-001",
            tipoAtendimento: "Acolhimento social",
            unidadeDestinoId: "unidade-001",
            observacoes: "Registro fictício de teste.",
            profissionalId: "prof-demo-001"
          })
        }
      );

      const dados = await resposta.json();

      assert.equal(resposta.status, 201);
      assert.equal(
        dados.encaminhamento.codigoCaso,
        "TESTE-001"
      );
      assert.equal(
        dados.encaminhamento.status,
        "pendente"
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            codigoCaso: "TESTE-002",
            nome: "Pessoa Fictícia",
            tipoAtendimento: "Acolhimento social",
            unidadeDestinoId: "unidade-001",
            observacoes: "Teste de validação.",
            profissionalId: "prof-demo-001"
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
        `${baseUrl}/api/dashboard-profissional?profissionalId=prof-demo-001`
      );

      const dados = await resposta.json();

      assert.equal(resposta.status, 200);
      assert.equal(typeof dados.atendimentosHoje, "number");
      assert.equal(
        typeof dados.encaminhamentosPendentes,
        "number"
      );
    }
  );
});
