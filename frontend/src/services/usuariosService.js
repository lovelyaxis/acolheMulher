// Gestão de profissionais da rede (RF016) — uso exclusivo do administrador.
// Segue o modelo de unidadesService.js: usa o api.js central (token, timeout
// de 15s e tratamento de erro) e propaga a mensagem devolvida pelo backend.
import { api, ErroApi } from './api';

// Perfis aceitos pelo backend (usuariosController.js).
export const PERFIS_USUARIO = Object.freeze([
  'PROFISSIONAL',
  'ADMINISTRADOR',
]);

// Rótulos exibidos na tela.
export const ROTULOS_PERFIL = Object.freeze({
  PROFISSIONAL: 'Profissional',
  ADMINISTRADOR: 'Administrador',
});

// Limites validados pelo backend.
export const LIMITES_USUARIO = Object.freeze({
  nome: 100,
  email: 150,
  cargo: 100,
  senhaMin: 8,
  senhaMax: 72,
});

// Mesma expressão usada no controller.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MENSAGEM_USUARIO_NAO_ENCONTRADO = 'Usuário não encontrado.';

export const MENSAGEM_EMAIL_DUPLICADO = 'Este e-mail já está cadastrado.';

export const MENSAGEM_USUARIO_COM_VINCULOS =
  'Este profissional possui encaminhamentos e não pode ser excluído. Bloqueie a conta.';

export class ErroUsuario extends Error {
  constructor(mensagem, codigo = 'ERRO_USUARIO') {
    super(mensagem);
    this.name = 'ErroUsuario';
    this.codigo = codigo;
  }
}

// Remove espaços das pontas; valores não textuais viram string vazia.
function limpar(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

// O backend aceita unidadeId apenas como string não vazia ou ausente.
function normalizarUnidadeId(valor) {
  if (valor === undefined || valor === null || valor === '') return null;
  return typeof valor === 'string' ? valor : String(valor);
}

// GET /usuarios devolve um array; aceitamos também { usuarios: [] } por
// segurança, como faz o service de unidades.
function extrairLista(resposta) {
  if (Array.isArray(resposta)) return resposta;
  if (Array.isArray(resposta?.usuarios)) return resposta.usuarios;
  if (Array.isArray(resposta?.dados)) return resposta.dados;
  return [];
}

// Algumas respostas embrulham o registro; o controller devolve direto.
function extrairUsuario(resposta) {
  return resposta?.usuario || resposta?.dados || resposta;
}

// Valida os dados no front espelhando as regras do backend, para dar retorno
// imediato sem depender da rede. A existência da unidade é checada no servidor.
export function validarDadosUsuario(dados = {}, { exigeSenha = false } = {}) {
  const nome = limpar(dados.nome);
  const email = limpar(dados.email).toLowerCase();
  const cargo = limpar(dados.cargo);

  if (!nome || nome.length > LIMITES_USUARIO.nome) {
    throw new ErroUsuario(
      `Informe o nome (até ${LIMITES_USUARIO.nome} caracteres).`,
      'DADOS_INVALIDOS',
    );
  }

  if (
    !email ||
    email.length > LIMITES_USUARIO.email ||
    !EMAIL_REGEX.test(email)
  ) {
    throw new ErroUsuario('Informe um e-mail válido.', 'DADOS_INVALIDOS');
  }

  if (cargo.length > LIMITES_USUARIO.cargo) {
    throw new ErroUsuario(
      `O cargo deve ter no máximo ${LIMITES_USUARIO.cargo} caracteres.`,
      'DADOS_INVALIDOS',
    );
  }

  if (dados.perfil !== undefined && !PERFIS_USUARIO.includes(dados.perfil)) {
    throw new ErroUsuario(
      `Perfil inválido. Use: ${PERFIS_USUARIO.join(', ')}.`,
      'DADOS_INVALIDOS',
    );
  }

  const senha = dados.senha;
  const temSenha = senha !== undefined && senha !== null && senha !== '';

  if (exigeSenha && !temSenha) {
    throw new ErroUsuario('Informe a senha.', 'DADOS_INVALIDOS');
  }

  if (temSenha) {
    if (
      typeof senha !== 'string' ||
      senha.length < LIMITES_USUARIO.senhaMin ||
      senha.length > LIMITES_USUARIO.senhaMax
    ) {
      throw new ErroUsuario(
        `A senha deve ter entre ${LIMITES_USUARIO.senhaMin} e ${LIMITES_USUARIO.senhaMax} caracteres.`,
        'DADOS_INVALIDOS',
      );
    }
  }

  return { nome, email, cargo, senha: temSenha ? senha : null };
}

// Monta o corpo enviado ao backend, campo a campo: evita vazar propriedades
// extras e garante que senha vazia na edição não sobrescreva a senha atual.
function prepararDados(dados = {}, { exigeSenha = false } = {}) {
  const { nome, email, cargo, senha } = validarDadosUsuario(dados, {
    exigeSenha,
  });

  const corpo = { nome, email, cargo: cargo || null };

  if (dados.perfil !== undefined) {
    corpo.perfil = dados.perfil;
  }

  // Na edição, unidadeId ausente mantém o vínculo atual (não enviamos a chave).
  if (dados.unidadeId !== undefined) {
    corpo.unidadeId = normalizarUnidadeId(dados.unidadeId);
  }

  if (senha) {
    corpo.senha = senha;
  }

  return corpo;
}

// Converte erros da API em erros compreensíveis para a tela, preservando a
// mensagem original do backend quando existir.
function tratarErro(erro) {
  if (erro instanceof ErroUsuario) {
    return erro;
  }

  if (erro instanceof ErroApi) {
    if (erro.status === 404) {
      return new ErroUsuario(
        erro.message || MENSAGEM_USUARIO_NAO_ENCONTRADO,
        'USUARIO_NAO_ENCONTRADO',
      );
    }

    if (erro.status === 409) {
      const mensagem = erro.message || MENSAGEM_EMAIL_DUPLICADO;
      const codigo = /encaminhamento|vinculad/i.test(mensagem)
        ? 'USUARIO_COM_VINCULOS'
        : 'EMAIL_DUPLICADO';

      return new ErroUsuario(
        codigo === 'USUARIO_COM_VINCULOS'
          ? MENSAGEM_USUARIO_COM_VINCULOS
          : mensagem,
        codigo,
      );
    }

    if (erro.status === 400) {
      return new ErroUsuario(
        erro.message || 'Dados inválidos.',
        'DADOS_INVALIDOS',
      );
    }

    if (erro.status === 401) {
      return new ErroUsuario(
        erro.message || 'Sua sessão expirou. Entre novamente.',
        'SESSAO_EXPIRADA',
      );
    }

    if (erro.status === 403) {
      return new ErroUsuario(
        erro.message || 'Você não tem permissão para gerenciar profissionais.',
        'SEM_PERMISSAO',
      );
    }

    return new ErroUsuario(
      erro.message || 'Não foi possível realizar a operação.',
      'ERRO_API',
    );
  }

  return new ErroUsuario(
    erro?.message || 'Ocorreu um erro inesperado.',
    'ERRO_USUARIO',
  );
}

// Lista todos os usuários (profissionais e administradores).
export async function listarUsuarios() {
  try {
    const resposta = await api.get('/usuarios');
    return extrairLista(resposta);
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Cadastra um profissional (RF016). A senha é obrigatória no cadastro.
export async function criarUsuario(dados = {}) {
  try {
    const corpo = prepararDados(dados, { exigeSenha: true });
    const resposta = await api.post('/usuarios', corpo);
    return extrairUsuario(resposta);
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Edita um profissional. A senha é opcional: quando vazia, é mantida.
export async function atualizarUsuario(id, dados = {}) {
  try {
    const corpo = prepararDados(dados, { exigeSenha: false });
    const resposta = await api.put(`/usuarios/${encodeURIComponent(id)}`, corpo);
    return extrairUsuario(resposta);
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Bloqueia (ativo = false) ou desbloqueia (ativo = true) a conta.
// O backend também zera tentativasLogin e bloqueadoAte ao reativar.
export async function alterarStatusUsuario(id, ativo) {
  try {
    if (typeof ativo !== 'boolean') {
      throw new ErroUsuario(
        'Informe o campo ativo como true ou false.',
        'DADOS_INVALIDOS',
      );
    }

    const resposta = await api.patch(
      `/usuarios/${encodeURIComponent(id)}/status`,
      { ativo },
    );

    return extrairUsuario(resposta);
  } catch (erro) {
    throw tratarErro(erro);
  }
}

// Exclui um profissional. O backend recusa a auto-exclusão (400) e contas com
// encaminhamentos vinculados (409) — nesse caso a mensagem orienta a bloquear.
export async function excluirUsuario(id) {
  try {
    return await api.delete(`/usuarios/${encodeURIComponent(id)}`);
  } catch (erro) {
    throw tratarErro(erro);
  }
}
