require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/auth");
const unidadesRoutes = require("./src/routes/unidades");
const usuariosRoutes = require("./src/routes/usuarios");
const encaminhamentosRoutes = require("./src/routes/encaminhamentos");
const orientacoesRoutes = require("./src/routes/orientacoes");

const {
  unidades,
  usuarios,
  encaminhamentos,
  orientacoesAnonimas
} = require("./data/mockData");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use("/api/auth", authRoutes);
app.use("/api/unidades", unidadesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/encaminhamentos", encaminhamentosRoutes);
app.use("/api/orientacoes-anonimas", orientacoesRoutes);

// Não adicionar logs que armazenem IP ou conteúdo
// de mensagens do canal anônimo.

function buscarProfissional(id) {
  return usuarios.find(
    usuario =>
      usuario.id === id &&
      usuario.perfil === "profissional"
  );
}

// Verificar se a API está funcionando.
app.get("/api", (req, res) => {
  res.status(200).json({
    mensagem: "API AcolheMulher funcionando.",
    ambiente: "prototipo-academico"
  });
});








// RF010 - Indicadores do dashboard profissional.
app.get("/api/dashboard-profissional", (req, res) => {
  const { profissionalId } = req.query;

  if (
    typeof profissionalId !== "string" ||
    profissionalId.trim() === ""
  ) {
    return res.status(400).json({
      erro: "Informe o profissional demonstrativo."
    });
  }

  const profissional = buscarProfissional(profissionalId);

  if (!profissional) {
    return res.status(404).json({
      erro: "Profissional não encontrado."
    });
  }

  const registros = encaminhamentos.filter(
    item => item.profissionalId === profissional.id
  );

  const hoje = new Date().toISOString().slice(0, 10);

  const atendimentosHoje = registros.filter(
    item => item.criadoEm.slice(0, 10) === hoje
  ).length;

  const encaminhamentosPendentes = registros.filter(
    item => item.status === "pendente"
  ).length;

  return res.status(200).json({
    profissionalId: profissional.id,
    atendimentosHoje,
    encaminhamentosPendentes,
    totalEncaminhamentos: registros.length
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
