require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/auth");
const unidadesRoutes = require("./src/routes/unidades");
const usuariosRoutes = require("./src/routes/usuarios");
const encaminhamentosRoutes = require("./src/routes/encaminhamentos");
const orientacoesRoutes = require("./src/routes/orientacoes");
const dashboardRoutes = require("./src/routes/dashboard");


const app = express();
const PORT = process.env.PORT || 3000;

// Origem do front-end autorizada a chamar a API.
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.disable("x-powered-by");

// Cabeçalhos básicos de segurança. Não inclui CSP para não afetar a API.
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "10kb" }));
app.use("/api/auth", authRoutes);
app.use("/api/unidades", unidadesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/encaminhamentos", encaminhamentosRoutes);
app.use("/api/orientacoes-anonimas", orientacoesRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Não adicionar logs que armazenem IP ou conteúdo
// de mensagens do canal anônimo.


// Verificar se a API está funcionando.
app.get("/api", (req, res) => {
  res.status(200).json({
    mensagem: "API AcolheMulher funcionando.",
    ambiente: "prototipo-academico"
  });
});

// Responder quando uma rota não existir.
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada."
  });
});

// Tratar erros sem registrar o conteúdo da requisição
// (importante para o canal de orientação anônima).
app.use((erro, req, res, next) => {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido." });
  }
  if (erro.type === "entity.too.large") {
    return res.status(413).json({ erro: "Requisição grande demais." });
  }
  console.error("Erro inesperado:", erro.type || erro.name);
  return res.status(500).json({ erro: "Erro interno do servidor." });
});

// Permitir testes automatizados sem iniciar uma porta.
module.exports = app;

// Iniciar o servidor quando executado diretamente.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API AcolheMulher em http://localhost:${PORT}`);
  });
}
