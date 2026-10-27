
const express = require("express");
const cors = require("cors");

const {
  unidades,
  encaminhamentos,
  orientacoesAnonimas
} = require("./data/mockData");

const app = express();
const PORT = process.env.PORT || 3000;

// Permite chamadas do frontend durante o desenvolvimento.
// Em produção, restringir a origem e configurar HTTPS.
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Não adicionar middleware de log de requisições que registre
// IP, cabeçalhos ou conteúdo de mensagens anônimas.

// Rota inicial para verificar se a API está funcionando.
app.get("/api", (req, res) => {
  res.status(200).json({
    mensagem: "API AcolheMulher funcionando.",
    ambiente: "prototipo-academico"
  });
});

// RF006 + RN001
// Recebe uma mensagem sem exigir dados pessoais.
app.post("/api/orientacoes-anonimas", (req, res) => {
  const { mensagem, categoria } = req.body || {};

  const categoriasPermitidas = [
    "direitos",
    "violencia",
    "atendimento",
    "outros"
  ];

  if (
    typeof mensagem !== "string" ||
    mensagem.trim().length === 0
  ) {
    return res.status(400).json({
      erro: "A mensagem é obrigatória."
    });
  }

  if (mensagem.trim().length > 2000) {
    return res.status(400).json({
      erro: "A mensagem deve ter no máximo 2000 caracteres."
    });
  }

  if (
    typeof categoria !== "string" ||
    !categoriasPermitidas.includes(categoria)
  ) {
    return res.status(400).json({
      erro: "Informe uma categoria válida."
    });
  }

  // Guardamos exclusivamente o conteúdo e a categoria.
  // Campos adicionais enviados pelo cliente são ignorados.
  orientacoesAnonimas.push({
    mensagem: mensagem.trim(),
    categoria
  });

  return res.status(201).json({
    mensagem:
      "Mensagem recebida no protótipo de orientação anônima."
  });
});

// RF011 + RN002
// Registra um encaminhamento sem nome da pessoa atendida.
app.post("/api/encaminhamentos", (req, res) => {
  const {
    codigoCaso,
    tipoAtendimento,
    unidadeDestinoId,
    observacoes,
    profissionalId
  } = req.body || {};

  if (
    typeof codigoCaso !== "string" ||
    codigoCaso.trim().length < 3 ||
    codigoCaso.trim().length > 50
  ) {
    return res.status(400).json({
      erro: "Informe um código de caso válido."
    });
  }

  // Impede campos que claramente representam dados
  // pessoais de serem aceitos neste contrato de API.
  const camposProibidos = [
    "nome",
    "nomeCompleto",
    "cpf",
    "telefone"
  ];

  if (
    camposProibidos.some((campo) =>
      Object.prototype.hasOwnProperty.call(req.body, campo)
    )
  ) {
    return res.status(400).json({
      erro:
        "O encaminhamento não deve conter dados pessoais da pessoa atendida."
    });
  }

  if (
    typeof tipoAtendimento !== "string" ||
    !tipoAtendimento.trim() ||
    tipoAtendimento.length > 100
  ) {
    return res.status(400).json({
      erro: "Informe um tipo de atendimento válido."
    });
  }

  if (
    typeof unidadeDestinoId !== "string" ||
    !unidades.some(
      (unidade) =>
        unidade.id === unidadeDestinoId && unidade.ativa
    )
  ) {
    return res.status(400).json({
      erro: "A unidade de destino não existe ou está inativa."
    });
  }

  if (
    typeof observacoes !== "string" ||
    observacoes.length > 1000
  ) {
    return res.status(400).json({
      erro: "As observações devem ter no máximo 1000 caracteres."
    });
  }

  // Identificador de demonstração: não substitui autenticação.
  if (
    typeof profissionalId !== "string" ||
    !profissionalId.trim() ||
    profissionalId.length > 50
  ) {
    return res.status(400).json({
      erro: "Informe o identificador demonstrativo do profissional."
    });
  }

  const novoEncaminhamento = {
    id: `enc-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,
    codigoCaso: codigoCaso.trim(),
    tipoAtendimento: tipoAtendimento.trim(),
    unidadeDestinoId,
    observacoes: observacoes.trim(),
    status: "pendente",
    profissionalId: profissionalId.trim(),
    criadoEm: new Date().toISOString()
  };

  encaminhamentos.push(novoEncaminhamento);

  return res.status(201).json({
    mensagem: "Encaminhamento registrado com sucesso.",
    encaminhamento: novoEncaminhamento
  });
});

// RF010 (apoio)
// Retorna somente indicadores do profissional demonstrativo.
// A versão real precisa identificar o profissional pela sessão
// autenticada, e não confiar em um ID enviado pelo cliente.
app.get("/api/dashboard-profissional", (req, res) => {
  const { profissionalId } = req.query;

  if (
    typeof profissionalId !== "string" ||
    !profissionalId.trim()
  ) {
    return res.status(400).json({
      erro: "Informe o profissional demonstrativo."
    });
  }

  const registros = encaminhamentos.filter(
    (item) => item.profissionalId === profissionalId
  );

  const hoje = new Date().toISOString().slice(0, 10);

  const atendimentosHoje = registros.filter(
    (item) => item.criadoEm.slice(0, 10) === hoje
  ).length;

  const encaminhamentosPendentes = registros.filter(
    (item) => item.status === "pendente"
  ).length;

  return res.status(200).json({
    profissionalId,
    atendimentosHoje,
    encaminhamentosPendentes,
    totalEncaminhamentos: registros.length
  });
});

// Tratamento simples para rotas inexistentes.
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada."
  });
});

// Exportar o app permite testá-lo sem abrir uma porta
// de rede durante os testes automatizados.
module.exports = app;

// Iniciar o servidor apenas quando executado diretamente.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API AcolheMulher em http://localhost:${PORT}`);
  });
}
