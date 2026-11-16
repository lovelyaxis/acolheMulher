// Edição de unidade de atendimento (RF015) — exclusiva do administrador.
// Carrega a unidade pelo id, pré-preenche o formulário e salva via
// editarUnidade. Segue o padrão visual, labels, nomes de campo e mensagens de
// CadastroUnidade.jsx, sem reutilizar nem alterar aquele arquivo.
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MENSAGEM_UNIDADE_NAO_ENCONTRADA,
  TIPOS_UNIDADE,
  editarUnidade,
  listarUnidadesInternas,
} from '../services/unidadesService';
import Sidebar from '../components/Sidebar';

const FORMULARIO_INICIAL = {
  nome: '',
  tipo: '',
  telefone: '',
  endereco: '',
  horario: '',
  capacidade: '',
  vagasDisponiveis: '',
};

const MENSAGEM_ERRO_CARREGAMENTO =
  'Não foi possível carregar a unidade agora. Volte para a lista e tente novamente.';

export default function EditarUnidade() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(FORMULARIO_INICIAL);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrada, setNaoEncontrada] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const ehCasa = formData.tipo === 'Casa de Acolhimento';

  // Carga inicial: sem setState síncrono no corpo do effect (regra do
  // react-hooks), seguindo o padrão de BuscaUnidades.jsx / GerenciarUnidades.jsx.
  useEffect(() => {
    let desmontado = false;

    listarUnidadesInternas({ incluirInativas: true })
      .then((unidades) => {
        if (desmontado) return;

        const unidade = unidades.find((item) => item.id === id);

        if (!unidade) {
          setNaoEncontrada(true);
          return;
        }

        setFormData({
          nome: unidade.nome ?? '',
          tipo: unidade.tipo ?? '',
          telefone: unidade.telefone ?? '',
          endereco: unidade.endereco ?? '',
          horario: unidade.horario ?? '',
          capacidade:
            unidade.vagasTotal !== undefined && unidade.vagasTotal !== null
              ? unidade.vagasTotal
              : '',
          vagasDisponiveis:
            unidade.vagasDisponiveis !== undefined &&
            unidade.vagasDisponiveis !== null
              ? unidade.vagasDisponiveis
              : '',
        });
      })
      .catch(() => {
        if (desmontado) return;
        setErroCarregamento(MENSAGEM_ERRO_CARREGAMENTO);
      })
      .finally(() => {
        if (desmontado) return;
        setCarregando(false);
      });

    return () => {
      desmontado = true;
    };
  }, [id]);

  const handleChange = (e) => {
    setFeedback(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    // Não envia bairro nem cep (o formulário não os coleta). As vagas
    // disponíveis só vão quando o campo tiver valor; se estiver vazio, a chave
    // é omitida e a edição preserva o valor atual.
    const dados = {
      nome: formData.nome,
      tipo: formData.tipo,
      endereco: formData.endereco,
      telefone: formData.telefone,
      horario: formData.horario,
      vagasTotal: formData.capacidade,
    };

    if (formData.vagasDisponiveis !== '') {
      dados.vagasDisponiveis = formData.vagasDisponiveis;
    }

    setEnviando(true);

    try {
      await editarUnidade(id, dados);
      setFeedback({
        tipo: 'sucesso',
        mensagem: 'Unidade atualizada com sucesso.',
      });
      navigate('/admin/unidades');
    } catch (erro) {
      // ErroUnidade (DADOS_INVALIDOS, UNIDADE_DUPLICADA, UNIDADE_NAO_ENCONTRADA)
      // já traz uma mensagem clara em erro.message.
      setFeedback({
        tipo: 'erro',
        mensagem:
          erro?.message || 'Não foi possível salvar as alterações agora.',
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      <Sidebar activePath="/admin/unidades" />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Editar Unidade de Atendimento
            </h1>
            <p className="text-xs text-slate-500">Gestão da Rede</p>
          </div>
        </header>

        {carregando && (
          <p
            role="status"
            className="mb-6 max-w-3xl rounded-xl border border-purple-100 bg-white px-4 py-3 text-xs font-medium text-slate-700 shadow-sm"
          >
            Carregando unidade...
          </p>
        )}

        {!carregando && (naoEncontrada || erroCarregamento) && (
          <section
            role="alert"
            className="mb-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm"
          >
            <p className="font-medium">
              {naoEncontrada ? MENSAGEM_UNIDADE_NAO_ENCONTRADA : erroCarregamento}
            </p>
            <Link
              to="/admin/unidades"
              className="mt-4 inline-flex items-center bg-white hover:bg-slate-100 text-red-700 font-medium text-xs px-5 py-2.5 rounded-xl border border-red-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Voltar para a lista de unidades
            </Link>
          </section>
        )}

        {!carregando && !naoEncontrada && !erroCarregamento && (
          <section className="bg-white max-w-3xl rounded-2xl border border-purple-100 shadow-sm p-6 md:p-8">
            <h2 className="text-sm font-bold text-slate-900 mb-6">
              Dados da unidade
            </h2>

            {feedback && (
              <div
                role={feedback.tipo === 'erro' ? 'alert' : 'status'}
                className={`mb-5 rounded-xl border px-4 py-3 text-xs font-medium ${
                  feedback.tipo === 'erro'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                {feedback.mensagem}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da unidade*
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex.: Casa da Mulher Brasileira"
                  required
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo*
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition text-slate-600"
                  >
                    <option value="">Selecione o tipo</option>
                    {TIPOS_UNIDADE.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 0000-0000"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço*
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Rua, número, bairro, cidade"
                  required
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Horário de funcionamento
                  </label>
                  <input
                    type="text"
                    name="horario"
                    value={formData.horario}
                    onChange={handleChange}
                    placeholder="Ex.: Seg a sex, 8h às 18h"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  />
                </div>

                {ehCasa && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Capacidade / vagas
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="capacidade"
                      value={formData.capacidade}
                      onChange={handleChange}
                      placeholder="Ex.: 20 (se aplicável)"
                      required
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                    />
                  </div>
                )}
              </div>

              {ehCasa && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vagas disponíveis
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="vagasDisponiveis"
                    value={formData.vagasDisponiveis}
                    onChange={handleChange}
                    placeholder="Ex.: 5 (opcional)"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Se ficar em branco, mantemos as vagas disponíveis atuais.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={enviando}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-6 py-2.5 rounded-xl shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                >
                  {enviando ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/unidades')}
                  disabled={enviando}
                  className="bg-white hover:bg-slate-100 text-slate-600 font-medium text-xs px-6 py-2.5 rounded-xl border border-slate-200 transition disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
