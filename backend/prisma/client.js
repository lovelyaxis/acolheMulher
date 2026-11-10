require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

// Uma única instância do PrismaClient para todo o back-end.
// O Node guarda o módulo em cache, então todos os arquivos que fizerem
// require("../prisma/client") compartilham a mesma conexão.
const prisma = new PrismaClient();

module.exports = prisma;