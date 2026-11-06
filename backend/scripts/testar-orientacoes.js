require("dotenv").config();
const prisma = require("../src/config/prisma");

const URL = "http://localhost:3000/api/orientacoes-anonimas";
const MARCA = "TESTE-ANONIMO-AUTO";
let falhas = 0;

async function enviar(corpo) {
  const resposta = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo)
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
  await prisma.orientacaoAnonima.deleteMany({
    where: { mensagem: { startsWith: MARCA } }
  });
}

async function main() {
  await limpar();

  // Envio válido, com campos extras que NÃO podem ser gravados.
  const ok = await enviar({
    mensagem: `${MARCA} preciso de orientação`,
    categoria: "direitos",
    nome: "Fulana",
    email: "fulana@teste.com",
    telefone: "11999999999"
  });
  conferir("Envio válido (sem login)", ok.status, 201);

  // O que foi gravado tem só os 4 campos permitidos.
  const gravado = await prisma.orientacaoAnonima.findFirst({
    where: { mensagem: { startsWith: MARCA } }
  });
  conferir("Mensagem gravada no banco", gravado ? "gravada" : "não gravada", "gravada");
  if (gravado) {
    conferir(
      "Só guarda id, mensagem, categoria e data",
      Object.keys(gravado).sort().join(","),
      "categoria,criadoEm,id,mensagem"
    );
  }

  // Validações
  conferir("Sem mensagem", (await enviar({ categoria: "direitos" })).status, 400);
  conferir("Mensagem só com espaços", (await enviar({ mensagem: "   ", categoria: "direitos" })).status, 400);
  conferir("Mensagem não é texto", (await enviar({ mensagem: 123, categoria: "direitos" })).status, 400);
  conferir("Sem categoria", (await enviar({ mensagem: `${MARCA} x` })).status, 400);
  conferir("Categoria inválida", (await enviar({ mensagem: `${MARCA} x`, categoria: "xyz" })).status, 400);
  conferir(
    "Mensagem de 2000 caracteres",
    (await enviar({ mensagem: MARCA + "x".repeat(2000 - MARCA.length), categoria: "outros" })).status,
    201
  );
  conferir(
    "Mensagem de 2001 caracteres",
    (await enviar({ mensagem: MARCA + "x".repeat(2001 - MARCA.length), categoria: "outros" })).status,
    400
  );

  // JSON quebrado não pode derrubar nem vazar conteúdo.
  const quebrado = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"mensagem": "segredo'
  });
  conferir("JSON quebrado", quebrado.status, 400);
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