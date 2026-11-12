// Erros de aplicação com status HTTP e código estável para o frontend.
class ErroApp extends Error {
  constructor(status, codigo, mensagem, detalhes) {
    super(mensagem);
    this.name = "ErroApp";
    this.status = status;
    this.codigo = codigo;
    this.detalhes = detalhes;
  }
}

function erroRequisicao(codigo, mensagem, detalhes) {
  return new ErroApp(400, codigo, mensagem, detalhes);
}

function erroNaoEncontrado(mensagem = "Registro não encontrado.") {
  return new ErroApp(404, "NAO_ENCONTRADO", mensagem);
}

function erroConflito(codigo, mensagem) {
  return new ErroApp(409, codigo, mensagem);
}

// Envolve handlers assíncronos para que rejeições cheguem ao middleware de erro.
function asyncHandler(handler) {
  return function (req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = {
  ErroApp,
  erroRequisicao,
  erroNaoEncontrado,
  erroConflito,
  asyncHandler,
};
