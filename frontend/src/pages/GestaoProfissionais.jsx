import { useCallback, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { listarUnidadesInternas } from '../services/unidadesService';
import {
  listarProfissionais,
  cadastrarProfissional,
  editarProfissional,
  alterarStatusProfissional,
  excluirProfissional,
} from '../services/usuariosService';

const FORMULARIO_VAZIO = {
  nome: '',
  email: '',
  senha: '',
  cargo: '',
  unidadeId: '',
};

export default function GestaoProfissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [processandoId, setProcessandoId] = useState(null);
  const [erro, setErro] = useState('');
  const [feedback, setFeedback] = useState(null);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const [lista, unidadesDaRede] = await Promise.all([
        listarProfissionais(),
        listarUnidadesInternas(),
      ]);
      setProfissionais(lista.filter((usuario) => usuario.perfil === 'PROFISSIONAL'));
      setUnidades(unidadesDaRede);
    } catch (e) {
      setErro(e.message || 'Não foi possível carregar os profissionais.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const temporizador = setTimeout(carregarDados, 0);
    return () => clearTimeout(temporizador);
  }, [carregarDados]);

  function iniciarEdicao(profissional) {
    setEditandoId(profissional.id);
    setFormulario({
      nome: profissional.nome || '',
      email: profissional.email || '',
      senha: '',
      cargo: profissional.cargo || '',
      unidadeId: profissional.unidadeId || '',
    });
    setFeedback(null);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormulario(FORMULARIO_VAZIO);
    setFeedback(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSalvando(true);
    setFeedback(null);

    const dados = {
      nome: formulario.nome.trim(),
      email: formulario.email.trim(),
      cargo: formulario.cargo.trim(),
      unidadeId: formulario.unidadeId || null,
    };
    if (formulario.senha) dados.senha = formulario.senha;

    try {
      const mensagemSucesso = editandoId
        ? 'Profissional atualizado com sucesso.'
        : 'Profissional cadastrado com sucesso.';
      if (editandoId) {
        await editarProfissional(editandoId, dados);
      } else {
        await cadastrarProfissional({ ...dados, senha: formulario.senha });
      }
      cancelarEdicao();
      setFeedback({ tipo: 'sucesso', mensagem: mensagemSucesso });
      await carregarDados();
    } catch (e) {
      setFeedback({ tipo: 'erro', mensagem: e.message || 'Não foi possível salvar o profissional.' });
    } finally {
      setSalvando(false);
    }
  }

  async function handleStatus(profissional) {
    setProcessandoId(profissional.id);
    setFeedback(null);
    try {
      await alterarStatusProfissional(profissional.id, !profissional.ativo);
      setFeedback({
        tipo: 'sucesso',
        mensagem: profissional.ativo ? 'Profissional desativado.' : 'Profissional reativado.',
      });
      await carregarDados();
    } catch (e) {
      setFeedback({ tipo: 'erro', mensagem: e.message || 'Não foi possível alterar o status.' });
    } finally {
      setProcessandoId(null);
    }
  }

  async function handleExcluir(profissional) {
    const confirmado = window.confirm(
      `Excluir a conta de ${profissional.nome}? Esta ação não pode ser desfeita. Se houver encaminhamentos vinculados, desative a conta em vez de excluí-la.`,
    );
    if (!confirmado) return;

    setProcessandoId(profissional.id);
    setFeedback(null);
    try {
      await excluirProfissional(profissional.id);
      setFeedback({ tipo: 'sucesso', mensagem: 'Profissional excluído com sucesso.' });
      await carregarDados();
    } catch (e) {
      setFeedback({ tipo: 'erro', mensagem: e.message || 'Não foi possível excluir o profissional.' });
    } finally {
      setProcessandoId(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      <Sidebar activePath="/gestao-profissionais" />
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Profissionais</h1>
            <p className="text-xs text-slate-500">Cadastre, edite, desative ou exclua contas profissionais.</p>
          </div>
          <button
            type="button"
            onClick={() => { cancelarEdicao(); document.getElementById('form-profissional')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-purple-700"
          >
            + Novo Profissional
          </button>
        </header>

        {feedback && (
          <div role={feedback.tipo === 'erro' ? 'alert' : 'status'} className={`mb-6 rounded-xl border px-4 py-3 text-xs font-medium ${feedback.tipo === 'erro' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
            {feedback.mensagem}
          </div>
        )}

        <section id="form-profissional" className="mb-8 max-w-3xl rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-bold text-slate-900">{editandoId ? 'Editar profissional' : 'Cadastrar profissional'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-700">
                Nome *
                <input required maxLength={100} value={formulario.nome} onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </label>
              <label className="text-xs font-semibold text-slate-700">
                E-mail *
                <input required type="email" maxLength={150} value={formulario.email} onChange={(e) => setFormulario({ ...formulario, email: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-700">
                Senha {editandoId ? '(deixe em branco para manter)' : '*'}
                <input required={!editandoId} minLength={8} maxLength={72} type="password" autoComplete="new-password" value={formulario.senha} onChange={(e) => setFormulario({ ...formulario, senha: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </label>
              <label className="text-xs font-semibold text-slate-700">
                Cargo / função
                <input maxLength={100} value={formulario.cargo} onChange={(e) => setFormulario({ ...formulario, cargo: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </label>
            </div>
            <label className="block text-xs font-semibold text-slate-700">
              Unidade vinculada
              <select value={formulario.unidadeId} onChange={(e) => setFormulario({ ...formulario, unidadeId: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">Sem unidade vinculada</option>
                {unidades.map((unidade) => <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>)}
              </select>
            </label>
            <div className="flex flex-wrap gap-3 pt-2">
              <button disabled={salvando} type="submit" className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60">
                {salvando ? 'Salvando...' : editandoId ? 'Salvar alterações' : 'Cadastrar profissional'}
              </button>
              {editandoId && <button type="button" onClick={cancelarEdicao} className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50">Cancelar edição</button>}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-sm font-bold text-slate-900">Profissionais cadastrados</h2>
          {carregando && <p role="status" className="text-xs text-slate-600">Carregando profissionais...</p>}
          {!carregando && erro && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              <p>{erro}</p>
              <button type="button" onClick={carregarDados} className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 font-medium">Tentar novamente</button>
            </div>
          )}
          {!carregando && !erro && profissionais.length === 0 && <p role="status" className="text-xs text-slate-600">Nenhum profissional cadastrado.</p>}
          {!carregando && !erro && profissionais.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead><tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Nome / e-mail</th><th className="pb-3 font-semibold">Cargo / unidade</th><th className="pb-3 text-center font-semibold">Status</th><th className="pb-3 text-right font-semibold">Ações</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {profissionais.map((profissional) => {
                    const processando = processandoId === profissional.id;
                    return <tr key={profissional.id} className="hover:bg-purple-50/30">
                      <td className="py-4"><p className="font-medium text-slate-800">{profissional.nome}</p><p className="mt-1 text-slate-500">{profissional.email}</p></td>
                      <td className="py-4"><p>{profissional.cargo || 'Não informado'}</p><p className="mt-1 text-slate-500">{profissional.unidade?.nome || 'Sem unidade vinculada'}</p></td>
                      <td className="py-4 text-center"><span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${profissional.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{profissional.ativo ? 'Ativo' : 'Inativo'}</span></td>
                      <td className="py-4"><div className="flex flex-wrap justify-end gap-2">
                        <button type="button" onClick={() => iniciarEdicao(profissional)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">Editar</button>
                        <button type="button" disabled={processando} onClick={() => handleStatus(profissional)} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 font-medium text-amber-700 disabled:opacity-60">{profissional.ativo ? 'Desativar' : 'Reativar'}</button>
                        <button type="button" disabled={processando} onClick={() => handleExcluir(profissional)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-medium text-red-700 disabled:opacity-60">Excluir</button>
                      </div></td>
                    </tr>;
                  })}
                </tbody>
              </table>
              <p className="mt-4 text-xs leading-5 text-slate-500">Profissionais com encaminhamentos vinculados não podem ser excluídos; desative a conta para preservar o histórico.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
