/**
 * Seed do banco de dados AcolheMulher.
 *
 * Popula o banco com dados fictícios para demonstração.
 * É idempotente: pode ser executado novamente sem criar registros duplicados.
 *
 * Requisitos atendidos:
 *  - Pelo menos um administrador (RF016)
 *  - Pelo menos dois profissionais (RF016)
 *  - Algumas unidades de atendimento (RF014)
 *  - Alguns encaminhamentos demonstrativos (RF011)
 *  - Nenhuma mensagem real de orientação anônima (RN001, RNF001)
 *  - Senhas hasheadas com bcrypt (não SHA-256 do mock do navegador)
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

/**
 * Normaliza texto para comparação de duplicidade (ignora acentos, maiúsculas, espaços extras).
 * Mesmo algoritmo do frontend/src/services/unidadesService.js.
 */
function normalizarTexto(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

async function main() {
  console.log("Iniciando seed do banco AcolheMulher...");

  // Senhas de demonstração (apenas para ambiente acadêmico)
  const senhaAdmin = "Admin2026!";
  const senhaProfissional = "Acolhe2026!";
  const saltRounds = 10;

  const hashAdmin = await bcrypt.hash(senhaAdmin, saltRounds);
  const hashProfissional = await bcrypt.hash(senhaProfissional, saltRounds);

  // -----------------------------------------------------------
  // 1. Administrador (não vinculado a unidade)
  // -----------------------------------------------------------
  const administrador = await prisma.usuario.upsert({
    where: { email: "admin@acolhemulher.com.br" },
    update: {},
    create: {
      nome: "Maria Silva",
      email: "admin@acolhemulher.com.br",
      senhaHash: hashAdmin,
      perfil: "ADMINISTRADOR",
      cargo: "Gestora do sistema",
      unidadeId: null,
      ativo: true,
      tentativasLogin: 0,
      bloqueadoAte: null,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    },
  });
  console.log(`Administrador criado: ${administrador.nome} (${administrador.id})`);

  // -----------------------------------------------------------
  // 2. Profissionais (vinculados a unidades depois)
  // -----------------------------------------------------------
  const profissional1 = await prisma.usuario.upsert({
    where: { email: "ana@acolhemulher.com.br" },
    update: {},
    create: {
      nome: "Ana Paula",
      email: "ana@acolhemulher.com.br",
      senhaHash: hashProfissional,
      perfil: "PROFISSIONAL",
      cargo: "Assistente Social",
      unidadeId: null,
      ativo: true,
      tentativasLogin: 0,
      bloqueadoAte: null,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    },
  });
  console.log(`Profissional criado: ${profissional1.nome} (${profissional1.id})`);

  const profissional2 = await prisma.usuario.upsert({
    where: { email: "carla@acolhemulher.com.br" },
    update: {},
    create: {
      nome: "Carla Mendes",
      email: "carla@acolhemulher.com.br",
      senhaHash: hashProfissional,
      perfil: "PROFISSIONAL",
      cargo: "Psicóloga",
      unidadeId: null,
      ativo: true,
      tentativasLogin: 0,
      bloqueadoAte: null,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    },
  });
  console.log(`Profissional criado: ${profissional2.nome} (${profissional2.id})`);

  // -----------------------------------------------------------
  // 3. Unidades de atendimento
  // -----------------------------------------------------------
  const dadosUnidades = [
    {
      nome: "Delegacia da Mulher - Centro",
      tipo: "DELEGACIA_MULHER",
      endereco: "Rua das Flores, 123",
      bairro: "Centro",
      cep: "00000001",
      telefone: "(00) 0000-0001",
      horario: "Segunda a sexta, das 8h às 17h",
      vagasTotal: null,
      vagasDisponiveis: null,
      ativa: true,
    },
    {
      nome: "CRAS/CREAS - Norte",
      tipo: "CRAS_CREAS",
      endereco: "Av. Principal, 456",
      bairro: "Norte",
      cep: "00000003",
      telefone: "(00) 0000-0003",
      horario: "Segunda a sexta, das 8h às 18h",
      vagasTotal: null,
      vagasDisponiveis: null,
      ativa: true,
    },
    {
      nome: "Casa de Acolhimento - Flores",
      tipo: "CASA_ACOLHIMENTO",
      endereco: "Rua das Acácias, 789",
      bairro: "Flores",
      cep: "00000005",
      telefone: "(00) 0000-0005",
      horario: "24 horas, todos os dias",
      vagasTotal: 12,
      vagasDisponiveis: 8,
      ativa: true,
    },
    {
      nome: "Defensoria Pública - Sul",
      tipo: "DEFENSORIA_PUBLICA",
      endereco: "Av. da Liberdade, 321",
      bairro: "Sul",
      cep: "00000007",
      telefone: "(00) 0000-0007",
      horario: "Segunda a sexta, das 9h às 17h",
      vagasTotal: null,
      vagasDisponiveis: null,
      ativa: true,
    },
    {
      nome: "Hospital de Referência - Leste",
      tipo: "HOSPITAL_REFERENCIA",
      endereco: "Av. Saúde, 654",
      bairro: "Leste",
      cep: "00000008",
      telefone: "(00) 0000-0008",
      horario: "24 horas, todos os dias",
      vagasTotal: null,
      vagasDisponiveis: null,
      ativa: true,
    },
    {
      nome: "Delegacia da Mulher - Zona Oeste",
      tipo: "DELEGACIA_MULHER",
      endereco: "Rua do Sol, 987",
      bairro: "Oeste",
      cep: "00000002",
      telefone: "(00) 0000-0002",
      horario: "Segunda a sexta, das 8h às 17h",
      vagasTotal: null,
      vagasDisponiveis: null,
      ativa: false, // inativa (exemplo de unidade inativa)
    },
    {
      nome: "Casa de Acolhimento - Amanhecer",
      tipo: "CASA_ACOLHIMENTO",
      endereco: "Rua da Esperança, 147",
      bairro: "Amanhecer",
      cep: "00000006",
      telefone: "(00) 0000-0006",
      horario: "24 horas, todos os dias",
      vagasTotal: 5,
      vagasDisponiveis: 5,
      ativa: true,
    },
  ];

  const unidadesCriadas = [];
  for (const u of dadosUnidades) {
    const nomeNorm = normalizarTexto(u.nome);
    const enderecoNorm = normalizarTexto(u.endereco);

    // Verifica se já existe (idempotência via campos normalizados)
    const existente = await prisma.unidade.findFirst({
      where: {
        nomeNormalizado: nomeNorm,
        enderecoNormalizado: enderecoNorm,
      },
    });

    let unidade;
    if (existente) {
      unidade = existente;
      console.log(`Unidade já existia: ${unidade.nome} (${unidade.id})`);
    } else {
      unidade = await prisma.unidade.create({
        data: {
          ...u,
          nomeNormalizado: nomeNorm,
          enderecoNormalizado: enderecoNorm,
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        },
      });
      console.log(`Unidade criada: ${unidade.nome} (${unidade.id})`);
    }
    unidadesCriadas.push(unidade);
  }

  // -----------------------------------------------------------
  // 4. Vincular profissionais a unidades
  // -----------------------------------------------------------
  const unidadeCRAS = unidadesCriadas.find(u => u.tipo === "CRAS_CREAS");
  const unidadeDelegacia = unidadesCriadas.find(
    u => u.tipo === "DELEGACIA_MULHER" && u.ativa
  );

  await prisma.usuario.update({
    where: { id: profissional1.id },
    data: { unidadeId: unidadeCRAS.id },
  });
  console.log(`Profissional ${profissional1.nome} vinculado à unidade ${unidadeCRAS.nome}`);

  await prisma.usuario.update({
    where: { id: profissional2.id },
    data: { unidadeId: unidadeDelegacia.id },
  });
  console.log(`Profissional ${profissional2.nome} vinculado à unidade ${unidadeDelegacia.nome}`);

  // -----------------------------------------------------------
  // 5. Encaminhamentos demonstrativos
  // -----------------------------------------------------------
  const unidadeDestinoAcolhimento = unidadesCriadas.find(
    u => u.tipo === "CASA_ACOLHIMENTO" && u.ativa
  );
  const unidadeDestinoDefensoria = unidadesCriadas.find(
    u => u.tipo === "DEFENSORIA_PUBLICA"
  );
  const unidadeHospital = unidadesCriadas.find(
    u => u.tipo === "HOSPITAL_REFERENCIA"
  );

  const encaminhamentos = [
    {
      codigoCaso: "AM-001",
      tipoAtendimento: "Apoio psicológico",
      unidadeDestinoId: unidadeDestinoAcolhimento.id,
      observacoes: "Mulher encaminhada para acolhimento psicológico especializado.",
      status: "PENDENTE",
      profissionalId: profissional1.id,
    },
    {
      codigoCaso: "AM-002",
      tipoAtendimento: "Orientação jurídica",
      unidadeDestinoId: unidadeDestinoDefensoria.id,
      observacoes: "Solicitação de medida protetiva.",
      status: "CONCLUIDO",
      profissionalId: profissional2.id,
    },
    {
      codigoCaso: "AM-003",
      tipoAtendimento: "Assistência social",
      unidadeDestinoId: unidadeCRAS.id,
      observacoes: "Cadastro no CadÚnico e encaminhamento para benefícios.",
      status: "PENDENTE",
      profissionalId: profissional1.id,
    },
    {
      codigoCaso: "AM-004",
      tipoAtendimento: "Atendimento de saúde",
      unidadeDestinoId: unidadeHospital.id,
      observacoes: "Acompanhamento de saúde da mulher.",
      status: "CONCLUIDO",
      profissionalId: profissional2.id,
    },
  ];

  for (const e of encaminhamentos) {
    await prisma.encaminhamento.upsert({
      where: { codigoCaso: e.codigoCaso },
      update: {},
      create: {
        ...e,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    });
    console.log(`Encaminhamento criado: ${e.codigoCaso} (${e.tipoAtendimento})`);
  }

  // -----------------------------------------------------------
  // 6. Nenhuma mensagem de orientação anônima (tabela vazia por padrão)
  // -----------------------------------------------------------
  console.log("Tabela orientacaoAnonima deixada intencionalmente vazia (anonimato).");

  console.log("\nSeed concluído com sucesso!");
  console.log(`- 1 administrador: ${administrador.email}`);
  console.log(`- 2 profissionais: ${profissional1.email}, ${profissional2.email}`);
  console.log(`- ${unidadesCriadas.length} unidades`);
  console.log(`- ${encaminhamentos.length} encaminhamentos`);
  console.log("- 0 mensagens de orientação anônima");
}

main()
  .catch((e) => {
    console.error("Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
