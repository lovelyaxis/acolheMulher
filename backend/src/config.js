// Configuração central do backend.
// Lê o arquivo backend/.env (não versionado) e aplica padrões seguros para
// desenvolvimento. Nenhum segredo é impresso em logs.
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

function numeroInteiro(valor, padrao) {
  const numero = Number.parseInt(valor, 10);
  return Number.isInteger(numero) && numero > 0 ? numero : padrao;
}

function carregarConfig() {
  const ambiente = process.env.NODE_ENV || "development";
  const origemPadrao = "http://localhost:5173";
  const origens = String(process.env.CORS_ORIGIN || origemPadrao)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const jwtSecret =
    process.env.JWT_SECRET ||
    (ambiente === "production"
      ? null
      : "dev-apenas-acolhemulher-nao-use-em-producao");

  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET é obrigatório quando NODE_ENV=production. Configure backend/.env.",
    );
  }

  return {
    ambiente,
    porta: numeroInteiro(process.env.PORT, 3000),
    jwtSecret,
    jwtExpiraEm: process.env.JWT_EXPIRES_IN || "8h",
    origensCors: origens,
    urlFrontend: (process.env.FRONTEND_URL || origemPadrao).replace(/\/$/, ""),
    recuperacaoExpiraMinutos: numeroInteiro(
      process.env.PASSWORD_RESET_EXPIRES_MINUTES,
      1440,
    ),
    exporLinkRecuperacao: ambiente !== "production",
  };
}

module.exports = { carregarConfig };
