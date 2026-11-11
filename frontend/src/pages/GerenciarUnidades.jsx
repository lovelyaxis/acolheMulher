// Gestão da rede de atendimento (RF015, RN003) — visão exclusiva do
// administrador. Lista as unidades (inclusive inativas) e permite editar,
// inativar e excluir com segurança. Nunca acessa o mock direto: usa o service.
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  listarUnidadesInternas,
  inativarUnidade,
  excluirUnidade,
} from '../services/unidadesService';

const MENSAGEM_ERRO_LISTA =
  'Não foi possível carregar as unidades agora. Tente novamente em instantes.';

export default function GerenciarUnidades() {
  const [unidades, setUnidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [processandoId, setProcessandoId] = useState(null);

  const carregarUnidades = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      const resultado = await listarUnidadesInternas({ incluirInativas: true });
      setUnidades(resultado);
    } catch {
      setUnidades([]);
      setErro(MENSAGEM_ERRO_LISTA);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Carga inicial: evita setState síncrono no corpo do effect (regra do
  // react-hooks). O estado de carregamento já começa como true.
  useEffect(() => {
    let desmontado = false;

    listarUnidadesInternas({ incluirInativas: true })
      .then((resultado) => {
        if (desmontado) return;
        setUnidades(resultado);
      })
      .catch(() => {
        if (desmontado) return;
        setUnidades([]);
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

  const handleInativar = async (unidade) => {
    const confirmado = window.confirm(
      `Inativar a unidade "${unidade.nome}"? Ela deixará de aparecer na busca pública, mas o histórico é preservado para relatórios.`,
    );

    if (!confirmado) return;

    setFeedback(null);
    setProcessandoId(unidade.id);

    try {
      await inativarUnidade(unidade.id);
      setFeedback({
        tipo: 'sucesso',
        mensagem: `Unidade "${unidade.nome}" inativada com sucesso.`,
      });
      await carregarUnidades();
    } catch (erroInativar) {
      setFeedback({
        tipo: 'erro',
        mensagem:
          erroInativar?.message || 'Não foi possível inativar a unidade agora.',
      });
    } finally {
      setProcessandoId(null);
    }
  };

  const handleExcluir = async (unidade) => {
    const confirmado = window.confirm(
      `Excluir a unidade "${unidade.nome}"? Esta ação não pode ser desfeita. Unidades com encaminhamentos vinculados não podem ser excluídas.`,
    );

    if (!confirmado) return;

    setFeedback(null);
    setProcessandoId(unidade.id);

    try {
      await excluirUnidade(unidade.id);
      setFeedback({
        tipo: 'sucesso',
        mensagem: `Unidade "${unidade.nome}" excluída com sucesso.`,
      });
      await carregarUnidades();
    } catch (erroExcluir) {
      // RN003: unidade com encaminhamentos só pode ser inativada. O service já
      // devolve uma mensagem orientando a inativar; exibimos essa mensagem.
      const mensagem =
        erroExcluir?.codigo === 'UNIDADE_COM_ENCAMINHAMENTOS'
          ? erroExcluir.message
          : erroExcluir?.message || 'Não foi possível excluir a unidade agora.';

      setFeedback({ tipo: 'erro', mensagem });
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
            <Link
              to="/dashboard-admin"
              className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition"
            >
              Início
            </Link>
            <Link
              to="/admin/unidades"
              aria-current="page"
              className="flex items-center gap-3 bg-purple-600 text-white px-4 py-3 rounded-xl transition"
            >
              Gestão da Rede
            </Link>
            <Link
              to="/cadastrar-unidade"
              className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition"
            >
              Cadastrar Unidade
            </Link>
            <Link
              to="/gestao-profissionais"
              className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition"
            >
              Gestão de Profissionais
            </Link>
          </nav>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Gestão da Rede de Atendimento
            </h1>
            <p className="text-xs text-slate-500">
              Edite, inative ou exclua unidades cadastradas
            </p>
          </div>

          <Link
            to="/cadastrar-unidade"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            Cadastrar unidade
          </Link>
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

        <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 md:p-8">
          <h2 className="text-sm font-bold text-slate-900 mb-6">
            Unidades cadastradas
          </h2>

          {carregando && (
            <p
              role="status"
              className="rounded-xl border border-purple-100 bg-purple-50/50 px-4 py-3 text-xs font-medium text-slate-700"
            >
              Carregando unidades da rede...
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
                onClick={carregarUnidades}
                className="mt-3 inline-flex items-center bg-white hover:bg-slate-100 text-red-700 font-medium text-xs px-4 py-2 rounded-xl border border-red-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!carregando && !erro && unidades.length === 0 && (
            <div
              role="status"
              className="rounded-xl border border-purple-100 bg-purple-50/50 px-4 py-6 text-center text-xs font-medium text-slate-600"
            >
              Nenhuma unidade cadastrada ainda. Use “Cadastrar unidade” para
              começar.
            </div>
          )}

          {!carregando && !erro && unidades.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <caption className="sr-only">
                  Lista de unidades de atendimento cadastradas, com tipo,
                  endereço, encaminhamentos, status e ações disponíveis.
                </caption>

                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                    <th scope="col" className="pb-3 font-semibold">
                      Unidade
                    </th>
                    <th scope="col" className="pb-3 font-semibold">
                      Tipo
                    </th>
                    <th scope="col" className="pb-3 font-semibold">
                      Endereço
                    </th>
                    <th scope="col" className="pb-3 font-semibold">
                      Encaminhamentos
                    </th>
                    <th scope="col" className="pb-3 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="pb-3 font-semibold text-right">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {unidades.map((unidade) => {
                    const processando = processandoId === unidade.id;

                    return (
                      <tr
                        key={unidade.id}
                        className="hover:bg-purple-50/30 transition"
                      >
                        <td className="py-4 font-medium text-slate-800">
                          {unidade.nome}
                        </td>
                        <td className="py-4 text-slate-600">{unidade.tipo}</td>
                        <td className="py-4 text-slate-600">
                          {unidade.endereco}
                        </td>
                        <td className="py-4 text-slate-600">
                          {unidade.totalEncaminhamentos ?? 'Não informado'}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                              unidade.ativa
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {unidade.ativa ? 'Ativa' : 'Inativa'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <Link
                              to={`/admin/unidades/${unidade.id}/editar`}
                              aria-label={`Editar a unidade ${unidade.nome}`}
                              className="inline-block bg-white hover:bg-slate-100 text-slate-700 font-medium text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                            >
                              Editar
                            </Link>

                            {unidade.ativa && (
                              <button
                                type="button"
                                onClick={() => handleInativar(unidade)}
                                disabled={processando}
                                aria-label={`Inativar a unidade ${unidade.nome}`}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium text-[11px] px-3 py-1.5 rounded-lg border border-amber-200 transition disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                              >
                                Inativar
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleExcluir(unidade)}
                              disabled={processando}
                              aria-label={`Excluir a unidade ${unidade.nome}`}
                              className="bg-red-50 hover:bg-red-100 text-red-700 font-medium text-[11px] px-3 py-1.5 rounded-lg border border-red-200 transition disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Unidades com encaminhamentos vinculados não podem ser excluídas
                (RN003) — apenas inativadas, preservando o histórico para
                relatórios.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
