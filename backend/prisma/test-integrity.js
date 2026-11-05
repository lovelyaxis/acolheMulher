/**
 * Testes de integridade do banco de dados AcolheMulher (Tarefa 7)
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

let passed = 0;
let failed = 0;

function test(nome, fn) {
  return fn()
    .then(() => {
      console.log(`  ✅ ${nome}`);
      passed++;
    })
    .catch((e) => {
      console.log(`  ❌ ${nome}: ${e.message}`);
      failed++;
    });
}

async function main() {
  console.log("\n=== TESTES DE INTEGRIDADE DO BANCO AcolheMulher ===\n");

  // -----------------------------------------------------------
  // 1. Cadastrar um usuário
  // -----------------------------------------------------------
  await test("Cadastrar um novo usuário", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Teste Usuário",
        email: "teste@acolhemulher.com.br",
        senhaHash: "hashqualquer",
        perfil: "PROFISSIONAL",
        cargo: "Testador",
        unidadeId: null,
        ativo: true,
        tentativasLogin: 0,
        bloqueadoAte: null,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    });
    if (!user.id) throw new Error("Usuário não foi criado");
    await prisma.usuario.delete({ where: { id: user.id } });
  });

  // -----------------------------------------------------------
  // 2. Impedir cadastro de e-mail duplicado
  // -----------------------------------------------------------
  await test("Impedir cadastro de e-mail duplicado", async () => {
    try {
      await prisma.usuario.create({
        data: {
          nome: "Duplicado",
          email: "admin@acolhemulher.com.br", // já existe no seed
          senhaHash: "hash",
          perfil: "PROFISSIONAL",
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        },
      });
      throw new Error("Não impediu e-mail duplicado");
    } catch (e) {
      if (e.code === "P2002") {
        // Erro esperado - unique constraint
        return;
      }
      throw e;
    }
  });

  // -----------------------------------------------------------
  // 3. Cadastrar uma unidade
  // -----------------------------------------------------------
  await test("Cadastrar uma nova unidade", async () => {
    const unidade = await prisma.unidade.create({
      data: {
        nome: "Unidade Teste",
        tipo: "DELEGACIA_MULHER",
        endereco: "Rua Teste, 999",
        bairro: "Bairro Teste",
        cep: "99999999",
        telefone: "(00) 0000-9999",
        horario: "Seg a sex, 8h às 18h",
        ativa: true,
        nomeNormalizado: "unidade teste",
        enderecoNormalizado: "rua teste, 999",
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    });
    if (!unidade.id) throw new Error("Unidade não foi criada");
    await prisma.unidade.delete({ where: { id: unidade.id } });
  });

  // -----------------------------------------------------------
  // 4. Impedir unidade duplicada
  // -----------------------------------------------------------
  await test("Impedir unidade duplicada (nome + endereço normalizados)", async () => {
    try {
      await prisma.unidade.create({
        data: {
          nome: "Delegacia da Mulher - Centro",
          tipo: "DELEGACIA_MULHER",
          endereco: "Rua das Flores, 123",
          bairro: "Centro",
          cep: "00000001",
          telefone: "(00) 0000-0001",
          horario: "Segunda a sexta, das 8h às 17h",
          ativa: true,
          nomeNormalizado: "delegacia da mulher - centro",
          enderecoNormalizado: "rua das flores, 123",
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        },
      });
      throw new Error("Não impediu unidade duplicada");
    } catch (e) {
      if (e.code === "P2002") {
        return;
      }
      throw e;
    }
  });

  // -----------------------------------------------------------
  // 5. Cadastrar um encaminhamento
  // -----------------------------------------------------------
  await test("Cadastrar um novo encaminhamento", async () => {
    const prof = await prisma.usuario.findFirst({
      where: { perfil: "PROFISSIONAL" },
    });
    const unid = await prisma.unidade.findFirst({
      where: { ativa: true },
    });
    const enc = await prisma.encaminhamento.create({
      data: {
        codigoCaso: "AM-TEST-001",
        tipoAtendimento: "Apoio psicológico",
        unidadeDestinoId: unid.id,
        observacoes: "Teste de integridade",
        status: "PENDENTE",
        profissionalId: prof.id,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    });
    if (!enc.id) throw new Error("Encaminhamento não foi criado");
    await prisma.encaminhamento.delete({ where: { id: enc.id } });
  });

  // -----------------------------------------------------------
  // 6. Impedir encaminhamento com unidade inexistente
  // -----------------------------------------------------------
  await test("Impedir encaminhamento com unidade inexistente", async () => {
    try {
      await prisma.encaminhamento.create({
        data: {
          codigoCaso: "AM-TEST-002",
          tipoAtendimento: "Teste",
          unidadeDestinoId: "uuid-inexistente-000",
          observacoes: "Teste",
          status: "PENDENTE",
          profissionalId: "prof-existente",
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        },
      });
      throw new Error("Não impediu unidade inexistente");
    } catch (e) {
      if (e.code === "P2003") {
        // Foreign key constraint
        return;
      }
      throw e;
    }
  });

  // -----------------------------------------------------------
  // 7. Impedir encaminhamento com profissional inexistente
  // -----------------------------------------------------------
  await test("Impedir encaminhamento com profissional inexistente", async () => {
    try {
      await prisma.encaminhamento.create({
        data: {
          codigoCaso: "AM-TEST-003",
          tipoAtendimento: "Teste",
          unidadeDestinoId: "unid-existente",
          observacoes: "Teste",
          status: "PENDENTE",
          profissionalId: "uuid-inexistente-000",
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        },
      });
      throw new Error("Não impediu profissional inexistente");
    } catch (e) {
      if (e.code === "P2003") {
        return;
      }
      throw e;
    }
  });

  // -----------------------------------------------------------
  // 8. Verificar se uma unidade vinculada a encaminhamentos não pode ser excluída
  // -----------------------------------------------------------
  await test("Impedir exclusão de unidade com encaminhamentos vinculados", async () => {
    const unidComEnc = await prisma.unidade.findFirst({
      where: {
        encaminhamentosDestino: { some: {} },
      },
    });
    if (!unidComEnc) {
      console.log("    (pulado - não há unidade com encaminhamentos)");
      return;
    }
    try {
      await prisma.unidade.delete({ where: { id: unidComEnc.id } });
      throw new Error("Não impediu exclusão de unidade com encaminhamentos");
    } catch (e) {
      if (e.code === "P2003") {
        return;
      }
      throw e;
    }
  });

  // -----------------------------------------------------------
  // 9. Atualizar a situação de uma unidade
  // -----------------------------------------------------------
  await test("Atualizar situação (ativa/inativa) de uma unidade", async () => {
    const unid = await prisma.unidade.findFirst();
    const atualizada = await prisma.unidade.update({
      where: { id: unid.id },
      data: { ativa: !unid.ativa },
    });
    if (atualizada.ativa === unid.ativa) throw new_error("Situação não alterada");
    // Reverte
    await prisma.unidade.update({
      where: { id: unid.id },
      data: { ativa: unid.ativa },
    });
  });

  // -----------------------------------------------------------
  // 10. Consultar as mensagens anônimas sem informações de identificação
  // -----------------------------------------------------------
  await test("Consultar mensagens anônimas (tabela vazia, sem dados de identificação)", async () => {
    const msgs = await prisma.orientacaoAnonima.findMany();
    if (!Array.isArray(msgs)) throw new Error("Não retornou array");
    // Verificar que não há campos de identificação
    const campos = Object.keys(msgs[0] || {});
    const proibidos = ["nome", "cpf", "telefone", "ip", "usuarioId", "remetenteId"];
    const encontrado = proibidos.filter((p) => campos.includes(p));
    if (encontrado.length > 0) {
      throw new Error(`Campos proibidos encontrados: ${encontrado.join(", ")}`);
    }
  });

  // -----------------------------------------------------------
  // 11. Verificar se os dados continuam existindo
  // -----------------------------------------------------------
  await test("Verificar persistência dos dados (contar registros)", async () => {
    const usuarios = await prisma.usuario.count();
    const unidades = await prisma.unidade.count();
    const encaminhamentos = await prisma.encaminhamento.count();
    const anonimas = await prisma.orientacaoAnonima.count();

    if (usuarios < 3) throw new Error(`Esperava >=3 usuarios, encontrou ${usuarios}`);
    if (unidades < 7) throw new Error(`Esperava >=7 unidades, encontrou ${unidades}`);
    if (encaminhamentos < 4) throw new Error(`Esperava >=4 encaminhamentos, encontrou ${encaminhamentos}`);
    if (anonimas !== 0) throw new Error(`Esperava 0 orientacoes anonimas, encontrou ${anonimas}`);
  });

  // -----------------------------------------------------------
  // Resumo
  // -----------------------------------------------------------
  console.log(`\n=== RESUMO: ${passed} passou, ${failed} falhou ===\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

function new_error(msg) {
  return new Error(msg);
}

main()
  .catch((e) => {
    console.error("Erro fatal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
