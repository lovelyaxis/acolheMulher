require("dotenv").config();
const express = require("express");
const cors = require("cors");

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

// Listar usuários fictícios para testes.
app.get("/api/usuarios", (req, res) => {
  res.status(200).json(usuarios);
});

// Listar unidades de atendimento.
app.get("/api/unidades", (req, res) => {
  res.status(200).json(unidades);
});

// T15 / RF006 / RN001 - Canal de orientação anônima.
app.post("/api/orientacoes-anonimas", (req, res) => {
  const corpo = req.body || {};
  const { mensagem, categoria } = corpo;

  const categoriasPermitidas = [
    "direitos",
    "violencia",
    "atendimento",
    "outros"
  ];

  if (
    typeof mensagem !== "string" ||
    mensagem.trim() === ""
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

  // Guardar somente a mensagem e a categoria.
  // Não salvar campos adicionais enviados pelo cliente.
  orientacoesAnonimas.push({
    mensagem: mensagem.trim(),
    categoria
  });

  return res.status(201).json({
    mensagem: "Orientação recebida com sucesso."
  });
});

// T13 / RF011 / RN002 - Registrar encaminhamento.
app.post("/api/encaminhamentos", (req, res) => {
  const corpo = req.body || {};

  const {
    codigoCaso,
    tipoAtendimento,
    unidadeDestinoId,
    observacoes,
    profissionalId
  } = corpo;

  // Impedir dados pessoais da pessoa atendida.
  const camposProibidos = [
    "nome",
    "nomeCompleto",
    "cpf",
    "telefone"
  ];

  const possuiDadosPessoais = camposProibidos.some(
    campo => Object.prototype.hasOwnProperty.call(corpo, campo)
  );

  if (possuiDadosPessoais) {
    return res.status(400).json({
      erro: "Não é permitido informar dados pessoais."
    });
  }

  if (
    typeof codigoCaso !== "string" ||
    codigoCaso.trim().length < 3 ||
    codigoCaso.trim().length > 50
  ) {
    return res.status(400).json({
      erro: "Informe um código de caso válido."
    });
  }

  if (
    typeof tipoAtendimento !== "string" ||
    tipoAtendimento.trim() === "" ||
    tipoAtendimento.trim().length > 100
  ) {
    return res.status(400).json({
      erro: "Informe um tipo de atendimento válido."
    });
  }

  const unidadeExiste = unidades.some(
    unidade =>
      unidade.id === unidadeDestinoId &&
      unidade.ativa === true
  );

  if (!unidadeExiste) {
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

  const profissional = buscarProfissional(profissionalId);

  if (!profissional) {
    return res.status(400).json({
      erro: "Profissional não encontrado."
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
    profissionalId: profissional.id,
    criadoEm: new Date().toISOString()
  };

  encaminhamentos.push(novoEncaminhamento);

  return res.status(201).json({
    mensagem: "Encaminhamento registrado com sucesso.",
    encaminhamento: novoEncaminhamento
  });
});

// T14 - Listar somente os encaminhamentos do profissional solicitado.
app.get("/api/encaminhamentos", (req, res) => {
  const { profissionalId } = req.query;

  if (
    typeof profissionalId !== "string" ||
    profissionalId.trim() === ""
  ) {
    return res.status(400).json({
      erro: "Informe o profissional."
    });
  }

  const profissional = buscarProfissional(profissionalId);

  if (!profissional) {
    return res.status(404).json({
      erro: "Profissional não encontrado."
    });
  }

  const lista = encaminhamentos.filter(
    item => item.profissionalId === profissional.id
  );

  return res.status(200).json(lista);
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

// Permitir testes automatizados sem iniciar uma porta.
module.exports = app;

// Iniciar o servidor quando executado diretamente.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API AcolheMulher em http://localhost:${PORT}`);
  });
}
