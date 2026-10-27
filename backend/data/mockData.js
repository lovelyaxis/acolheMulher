const hoje = () => new Date().toISOString();

const unidades = [
  {
    id: "unidade-001",
    nome: "Centro de Acolhimento Aurora",
    tipo: "Casa de Acolhimento",
    ativa: true
  },
  {
    id: "unidade-002",
    nome: "Centro de Apoio Horizonte",
    tipo: "CRAS/CREAS",
    ativa: true
  },
  {
    id: "unidade-003",
    nome: "Unidade de Proteção Girassol",
    tipo: "Delegacia da Mulher",
    ativa: true
  }
];

// Todos os registros abaixo são exemplos fictícios.
// Não incluir nome completo, CPF ou telefone da pessoa atendida.
const encaminhamentos = [
  {
    id: "enc-001",
    codigoCaso: "CASO-DEMO-001",
    tipoAtendimento: "Acolhimento social",
    unidadeDestinoId: "unidade-001",
    observacoes: "Exemplo fictício para validar o fluxo.",
    status: "pendente",
    profissionalId: "prof-demo-001",
    criadoEm: hoje()
  },
  {
    id: "enc-002",
    codigoCaso: "CASO-DEMO-002",
    tipoAtendimento: "Orientação jurídica",
    unidadeDestinoId: "unidade-003",
    observacoes: "Registro demonstrativo.",
    status: "concluido",
    profissionalId: "prof-demo-001",
    criadoEm: hoje()
  }
];

// O canal anônimo guarda somente mensagem e categoria.
// Não guardar nome, CPF, telefone, IP ou identificadores
// de quem enviou a mensagem.
const orientacoesAnonimas = [];

module.exports = {
  unidades,
  encaminhamentos,
  orientacoesAnonimas
};