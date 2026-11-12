// Cliente Prisma preguiçoso: só é criado quando uma rota realmente precisa do
// banco. Isso permite importar a aplicação e rodar testes com um Prisma falso
// mesmo sem DATABASE_URL configurada.
let cliente = null;

function getPrisma() {
  if (!cliente) {
    const { PrismaClient } = require("@prisma/client");
    cliente = new PrismaClient();
  }
  return cliente;
}

async function desconectarPrisma() {
  if (cliente) {
    await cliente.$disconnect();
    cliente = null;
  }
}

module.exports = { getPrisma, desconectarPrisma };
