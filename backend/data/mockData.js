
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
  },
  {
    id: "unidade-004",
    nome: "Centro de referência",
    tipo: "Centro de Referência",
    ativa: true
  },
  {
    id: "unidade-005",
    nome: "CRAS Centro",
    tipo: "CRAS",
    ativa: true
  },
  {
    id: "unidade-006",
    nome: "Defensoria Pública",
    tipo: "Defensoria Pública",
    ativa: true
  },
  {
    id: "unidade-007",
    nome: "Hospital de Referência",
    tipo: "Hospital",
    ativa: true
  },
  {
    id: "unidade-008",
    nome: "Unidade de atendimento",
    tipo: "Atendimento especializado",
    ativa: true
  }
];

// Usuários fictícios para o protótipo acadêmico.
// Não armazenamos senhas ou dados pessoais de pessoas atendidas.
const usuarios = [
  {
    id: "admin-001",
    nome: "Marina Souza",
    email: "admin@acolhemulher.com.br",
    perfil: "administrador"
  },
  {
    id: "prof-demo-001",
    nome: "Ana Oliveira",
    email: "ana@acolhemulher.com.br",
    perfil: "profissional"
  },
  {
    id: "prof-demo-002",
    nome: "Carlos Santos",
    email: "carlos@acolhemulher.com.br",
    perfil: "profissional"
  }
];

// Todos os registros abaixo são fictícios.
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

// Guardar somente mensagem e categoria.
// Não guardar nome, CPF, telefone, IP ou identificadores
// de quem enviou a mensagem.
const orientacoesAnonimas = [];

module.exports = {
  unidades,
  usuarios,
  encaminhamentos,
  orientacoesAnonimas
};
