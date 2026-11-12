// Gestão de profissionais (RF016) — visão exclusiva do administrador.
// Lista, cadastra, edita, bloqueia/desbloqueia e exclui contas da rede.
// Não usa mocks: consome a API pelo usuariosService.
import { useEffect, useMemo, useState } from 'react';
import {
  PERFIS_USUARIO,
  ROTULOS_PERFIL,
  LIMITES_USUARIO,
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  alterarStatusUsuario,
  excluirUsuario,
} from '../services/usuariosService';
import { listarUnidadesInternas } from '../services/unidadesService';

const MENSAGEM_ERRO_LISTA =
  'Não foi possível carregar os profissionais agora. Tente novamente em instantes.';

const FORMULARIO_VAZIO = {
  nome: '',
  email: '',
  cargo: '',
  perfil: 'PROFISSIONAL',
  unidadeId: '',
  senha: '',
};

// Formata a data de criação para exibição na lista.
function formatarData(valor) {
  if (!valor) return '—';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return '—';
  return data.toLocaleDateString('pt-BR');
}

// Monta o estado inicial do formulário a partir de um usuário da lista.
function formularioDoUsuario(usuario) {
  return {
    nome: usuario.nome ?? '',
    email: usuario.email ?? '',
    cargo: usuario.cargo ?? '',
    perfil: usuario.perfil ?? 'PROFISSIONAL',
    unidadeId: usuario.unidadeId ?? '',
    senha: '',
  };
}

export default function GestaoProfissionais() {
  const [usuarios, setUsuarios] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [processandoId, setProcessandoId] = useState(null);

  // Busca e filtro locais (não chamam a API).
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Controle do modal de cadastro/edição.
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VAZIO);
  const [erroFormulario, setErroFormulario] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Carga inicial da lista.
  useEffect(() => {
    let desmontado = false;

    listarUsuarios()
      .then((resultado) => {
        if (desmontado) return;
        setUsuarios(resultado);
      })
      .catch(() => {
        if (desmontado) return;
        setUsuarios([]);
        setErro(MENSAGEM_ERRO_LISTA);
      })
      .finally(() => {
        if (desmontado) return;
        setCarregando(false);
      });

    return () => {
      desmontado = true;
    };
  }, []);

  // Unidades para o vínculo opcional do profissional. Se falhar, o campo
  // continua utilizável (o vínculo é opcional); não bloqueia a tela.
  useEffect(() => {
    let desmontado = false;

    listarUnidadesInternas({ incluirInativas: false })
      .then((resultado) => {
        if (desmontado) return;
        setUnidades(resultado);
      })
      .catch(() => {
        if (desmontado) return;
        setUnidades([]);
      });

    return () => {
      desmontado = true;
    };
  }, []);

  const recarregar = async () => {
    setCarregando(true);
    setErro('');

    try {
      const resultado = await listarUsuarios();
      setUsuarios(resultado);
    } catch {
      setUsuarios([]);
      setErro(MENSAGEM_ERRO_LISTA);
    } finally {
      setCarregando(false);
    }
  };

  // Lista exibida: aplica busca por nome/e-mail e filtro por status.
  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const combinaTermo =
        !termo ||
        String(usuario.nome ?? '').toLowerCase().includes(termo) ||
        String(usuario.email ?? '').toLowerCase().includes(termo);

      const combinaStatus =
        filtroStatus === 'todos' ||
        (filtroStatus === 'ativos' && usuario.ativo) ||
        (filtroStatus === 'inativos' && !usuario.ativo);

      return combinaTermo && combinaStatus;
    });
  }, [usuarios, busca, filtroStatus]);

  const abrirCadastro = () => {
    setUsuarioEmEdicao(null);
    setFormulario(FORMULARIO_VAZIO);
    setErroFormulario('');
    setModalAberto(true);
  };

  const abrirEdicao = (usuario) => {
    setUsuarioEmEdicao(usuario);
    setFormulario(formularioDoUsuario(usuario));
    setErroFormulario('');
    setModalAberto(true);
  };

  const fecharModal = () => {
    if (salvando) return;
    // A senha nunca permanece em estado depois que o modal fecha.
    setModalAberto(false);
    setUsuarioEmEdicao(null);
    setFormulario(FORMULARIO_VAZIO);
    setErroFormulario('');
  };

  const atualizarCampo = (campo, valor) => {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  };

  const handleSalvar = async (evento) => {
    evento.preventDefault();

    // Evita duplo envio enquanto a requisição está em andamento.
    if (salvando) return;

    setSalvando(true);
    setErroFormulario('');

    try {
      const dados = {
        nome: formulario.nome,
        email: formulario.email,
        cargo: formulario.cargo,
        perfil: formulario.perfil,
        unidadeId: formulario.unidadeId || null,
        senha: formulario.senha,
      };

      if (usuarioEmEdicao) {
        const atualizado = await atualizarUsuario(usuarioEmEdicao.id, dados);

        setUsuarios((atual) =>
          atual.map((item) =>
            item.id === atualizado.id ? { ...item, ...atualizado } : item,
          ),
        );

        setFeedback({
          tipo: 'sucesso',
          mensagem: `Profissional "${atualizado.nome}" atualizado com sucesso.`,
        });
      } else {
        const criado = await criarUsuario(dados);

        setUsuarios((atual) =>
          [...atual, criado].sort((a, b) =>
            String(a.nome ?? '').localeCompare(String(b.nome ?? ''), 'pt-BR'),
          ),
        );

        setFeedback({
          tipo: 'sucesso',
          mensagem: `Profissional "${criado.nome}" cadastrado com sucesso.`,
        });
      }

      // Limpa a senha do estado antes de fechar.
      setFormulario(FORMULARIO_VAZIO);
      setModalAberto(false);
      setUsuarioEmEdicao(null);
    } catch (erroSalvar) {
      // A mensagem da API (validação, e-mail duplicado) fica no próprio modal.
      setErroFormulario(
        erroSalvar?.message || 'Não foi possível salvar o profissional agora.',
      );
    } finally {
      setSalvando(false);
    }
  };

  const handleAlterarStatus = async (usuario) => {
    const acao = usuario.ativo ? 'Bloquear' : 'Desbloquear';
    const confirmado = window.confirm(
      `${acao} a conta de "${usuario.nome}"?`,
    );

    if (!confirmado) return;

    setFeedback(null);
    setProcessandoId(usuario.id);

    try {
      const atualizado = await alterarStatusUsuario(usuario.id, !usuario.ativo);

      // Reflete o novo estado na lista sem recarregar tudo.
      setUsuarios((atual) =>
        atual.map((item) =>
          item.id === atualizado.id ? { ...item, ...atualizado } : item,
        ),
      );

      setFeedback({
        tipo: 'sucesso',
        mensagem: `Conta de "${atualizado.nome}" ${
          atualizado.ativo ? 'desbloqueada' : 'bloqueada'
        } com sucesso.`,
      });
    } catch (erroStatus) {
      setFeedback({
        tipo: 'erro',
        mensagem:
          erroStatus?.message ||
          'Não foi possível alterar o status da conta agora.',
      });
    } finally {
      setProcessandoId(null);
    }
  };

  const handleExcluir = async (usuario) => {
    const confirmado = window.confirm(
      `Excluir "${usuario.nome}"? Esta ação não pode ser desfeita. Profissionais com encaminhamentos vinculados não podem ser excluídos — nesse caso, bloqueie a conta.`,
    );

    if (!confirmado) return;

    setFeedback(null);
    setProcessandoId(usuario.id);

    try {
      await excluirUsuario(usuario.id);

      // Remove apenas a linha local, sem recarregar a lista.
      setUsuarios((atual) => atual.filter((item) => item.id !== usuario.id));

      setFeedback({
        tipo: 'sucesso',
        mensagem: `Profissional "${usuario.nome}" excluído com sucesso.`,
      });
    } catch (erroExcluir) {
      // O backend recusa auto-exclusão (400) e contas com encaminhamentos
      // (409); a mensagem devolvida já orienta o que fazer.
      setFeedback({
        tipo: 'erro',
        mensagem:
          erroExcluir?.message ||
          'Não foi possível excluir o profissional agora.',
      });
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 hidden md:flex">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">
              ♥
            </div>
            <span className="font-bold text-lg tracking-wide">AcolheMulher</span>
          </div>

          <nav className="space-y-2 text-sm font-medium">
            <a href="/cadastrar-unidade" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Gestão da Rede</a>
            <a href="/gestao-profissionais" className="flex items-center gap-3 bg-purple-600 text-white px-4 py-3 rounded-xl transition">Gestão de Profissionais</a>
            <a href="/relatorios" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Relatórios</a>
            <a href="/configuracoes" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Configurações</a>
          </nav>
        </div>

        <a href="/login" className="flex items-center gap-3 text-slate-400 hover:text-red-400 px-4 py-3 font-medium text-sm transition">
          Sair
        </a>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Profissionais</h1>
            <p className="text-xs text-slate-500">Equipa e colaboradores da rede de apoio</p>
          </div>

          <button
            type="button"
            onClick={abrirCadastro}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-sm transition"
          >
            + Novo Profissional
          </button>
        </header>

        {feedback && (
          <div
            role={feedback.tipo === 'erro' ? 'alert' : 'status'}
            className={`mb-6 rounded-xl border px-4 py-3 text-xs font-medium ${
              feedback.tipo === 'erro'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {feedback.mensagem}
          </div>
        )}

        {/* Tabela */}
        <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-6">Profissionais cadastrados</h2>

          {carregando && (
            <p
              role="status"
              className="rounded-xl border border-purple-100 bg-purple-50/50 px-4 py-3 text-xs font-medium text-slate-700"
            >
              Carregando profissionais...
            </p>
          )}

          {!carregando && erro && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
            >
              <p>{erro}</p>
              <button
                type="button"
                onClick={recarregar}
                className="mt-3 inline-flex items-center bg-white hover:bg-slate-100 text-red-700 font-medium text-xs px-4 py-2 rounded-xl border border-red-200 transition"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!carregando && !erro && usuarios.length === 0 && (
            <div
              role="status"
              className="rounded-xl border border-purple-100 bg-purple-50/50 px-4 py-6 text-center text-xs font-medium text-slate-600"
            >
              Nenhum profissional cadastrado ainda. Use “+ Novo Profissional”
              para começar.
            </div>
          )}

          {!carregando && !erro && usuarios.length > 0 && (
            <>
              {/* Busca e filtro locais */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1">
                  <label
                    htmlFor="busca-profissional"
                    className="sr-only"
                  >
                    Buscar profissional por nome ou e-mail
                  </label>
                  <input
                    id="busca-profissional"
                    type="search"
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                    placeholder="Buscar por nome ou e-mail"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="filtro-status" className="sr-only">
                    Filtrar por status
                  </label>
                  <select
                    id="filtro-status"
                    value={filtroStatus}
                    onChange={(evento) => setFiltroStatus(evento.target.value)}
                    className="w-full sm:w-auto rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-700 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <option value="todos">Todos os status</option>
                    <option value="ativos">Somente ativos</option>
                    <option value="inativos">Somente inativos</option>
                  </select>
                </div>
              </div>

              {usuariosFiltrados.length === 0 ? (
                <div
                  role="status"
                  className="rounded-xl border border-purple-100 bg-purple-50/50 px-4 py-6 text-center text-xs font-medium text-slate-600"
                >
                  Nenhum profissional encontrado com os filtros atuais.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <caption className="sr-only">
                      Lista de profissionais cadastrados, com cargo, unidade,
                      perfil, status e ações disponíveis.
                    </caption>
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                        <th scope="col" className="pb-3 font-semibold">Nome</th>
                        <th scope="col" className="pb-3 font-semibold">Cargo / Função</th>
                        <th scope="col" className="pb-3 font-semibold">Unidade Vinculada</th>
                        <th scope="col" className="pb-3 font-semibold">Perfil</th>
                        <th scope="col" className="pb-3 font-semibold text-center">Status</th>
                        <th scope="col" className="pb-3 font-semibold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {usuariosFiltrados.map((p) => {
                        const processando = processandoId === p.id;

                        return (
                          <tr key={p.id} className="hover:bg-purple-50/30 transition">
                            <td className="py-4 font-medium text-slate-800">
                              <span className="block">{p.nome}</span>
                              <span className="block text-[11px] font-normal text-slate-500">
                                {p.email}
                              </span>
                            </td>
                            <td className="py-4 text-slate-600">{p.cargo || '—'}</td>
                            <td className="py-4 text-slate-600">
                              {p.unidade?.nome || 'Sem vínculo'}
                            </td>
                            <td className="py-4 text-slate-600">
                              {ROTULOS_PERFIL[p.perfil] || p.perfil}
                            </td>
                            <td className="py-4 text-center">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                                  p.ativo
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {p.ativo ? 'Ativo' : 'Bloqueado'}
                              </span>
                              <span className="mt-1 block text-[11px] text-slate-400">
                                Desde {formatarData(p.criadoEm)}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => abrirEdicao(p)}
                                  disabled={processando}
                                  aria-label={`Editar o profissional ${p.nome}`}
                                  className="bg-white hover:bg-slate-100 text-slate-700 font-medium text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 transition disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  Editar
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleAlterarStatus(p)}
                                  disabled={processando}
                                  aria-label={`${p.ativo ? 'Bloquear' : 'Desbloquear'} a conta de ${p.nome}`}
                                  className={`font-medium text-[11px] px-3 py-1.5 rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                    p.ativo
                                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                  }`}
                                >
                                  {p.ativo ? 'Bloquear' : 'Desbloquear'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleExcluir(p)}
                                  disabled={processando}
                                  aria-label={`Excluir o profissional ${p.nome}`}
                                  className="bg-red-50 hover:bg-red-100 text-red-700 font-medium text-[11px] px-3 py-1.5 rounded-lg border border-red-200 transition disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  Remover
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    Contas com encaminhamentos vinculados não podem ser excluídas
                    — apenas bloqueadas, preservando o histórico para relatórios
                    (RN004).
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Modal de cadastro/edição */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-profissional"
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            <h2
              id="titulo-modal-profissional"
              className="text-sm font-bold text-slate-900 mb-6"
            >
              {usuarioEmEdicao ? 'Editar profissional' : 'Novo profissional'}
            </h2>

            {erroFormulario && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
              >
                {erroFormulario}
              </div>
            )}

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label
                  htmlFor="campo-nome"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Nome *
                </label>
                <input
                  id="campo-nome"
                  type="text"
                  required
                  maxLength={LIMITES_USUARIO.nome}
                  value={formulario.nome}
                  onChange={(evento) => atualizarCampo('nome', evento.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="campo-email"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  E-mail *
                </label>
                <input
                  id="campo-email"
                  type="email"
                  required
                  maxLength={LIMITES_USUARIO.email}
                  value={formulario.email}
                  onChange={(evento) => atualizarCampo('email', evento.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="campo-cargo"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Cargo / Função
                </label>
                <input
                  id="campo-cargo"
                  type="text"
                  maxLength={LIMITES_USUARIO.cargo}
                  value={formulario.cargo}
                  onChange={(evento) => atualizarCampo('cargo', evento.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="campo-perfil"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Perfil
                  </label>
                  <select
                    id="campo-perfil"
                    value={formulario.perfil}
                    onChange={(evento) => atualizarCampo('perfil', evento.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-700 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    {PERFIS_USUARIO.map((perfil) => (
                      <option key={perfil} value={perfil}>
                        {ROTULOS_PERFIL[perfil] || perfil}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="campo-unidade"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Unidade vinculada
                  </label>
                  <select
                    id="campo-unidade"
                    value={formulario.unidadeId}
                    onChange={(evento) => atualizarCampo('unidadeId', evento.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-700 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <option value="">Sem vínculo</option>
                    {unidades.map((unidade) => (
                      <option key={unidade.id} value={unidade.id}>
                        {unidade.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="campo-senha"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  {usuarioEmEdicao ? 'Nova senha (opcional)' : 'Senha *'}
                </label>
                <input
                  id="campo-senha"
                  type="password"
                  required={!usuarioEmEdicao}
                  minLength={LIMITES_USUARIO.senhaMin}
                  maxLength={LIMITES_USUARIO.senhaMax}
                  autoComplete="new-password"
                  value={formulario.senha}
                  onChange={(evento) => atualizarCampo('senha', evento.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  {usuarioEmEdicao
                    ? 'Deixe em branco para manter a senha atual.'
                    : `Entre ${LIMITES_USUARIO.senhaMin} e ${LIMITES_USUARIO.senhaMax} caracteres.`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs px-5 py-2.5 rounded-xl border border-slate-200 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
