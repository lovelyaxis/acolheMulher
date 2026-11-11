// Cria as tabelas no banco de TESTE aplicando as migrations do Prisma.
// Uso: npm run test:preparar
const path = require("node:path");
const { execSync } = require("node:child_process");

require("dotenv").config({ path: path.join(__dirname, "..", ".env.test") });

const url = process.env.DATABASE_URL || "";

if (!/_teste(\?.*)?$/.test(url)) {
  console.error(
    "Recusado: o DATABASE_URL do .env.test precisa terminar em _teste."
  );
  process.exit(1);
}

execSync("npx prisma migrate deploy", {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
  env: process.env,
});

console.log("Banco de teste pronto.");