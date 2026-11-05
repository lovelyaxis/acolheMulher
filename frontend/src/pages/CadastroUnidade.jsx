import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MENSAGEM_UNIDADE_DUPLICADA,
  TIPOS_UNIDADE,
  cadastrarUnidade,
  existeUnidadeDuplicada,
} from '../services/unidadesService';

const FORMULARIO_INICIAL = {
  nome: '',
  tipo: '',
  telefone: '',
  endereco: '',
  horario: '',
  capacidade: '',
  vagasDisponiveis: '',
};

export default function CadastroUnidade() {
  const [formData, setFormData] = useState(FORMULARIO_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const ehCasa = formData.tipo === 'Casa de Acolhimento';

  const handleChange = (e) => {
    setFeedback(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const dados = {
      nome: formData.nome,
      tipo: formData.tipo,
      endereco: formData.endereco,
      telefone: formData.telefone,
      horario: formData.horario,
      vagasTotal: formData.capacidade,
      vagasDisponiveis: formData.vagasDisponiveis,
    };

    if (existeUnidadeDuplicada(dados)) {
      setFeedback({ tipo: 'erro', mensagem: MENSAGEM_UNIDADE_DUPLICADA });
      return;
    }

    setEnviando(true);

    try {
      const unidade = await cadastrarUnidade(dados);

      setFeedback({
        tipo: 'sucesso',
        mensagem: `Unidade "${unidade.nome}" cadastrada com sucesso.`,
      });
      setFormData(FORMULARIO_INICIAL);
    } catch (erro) {
      setFeedback({
        tipo: 'erro',
        mensagem: erro?.message || 'Não foi possível cadastrar a unidade agora.',
      });
    } finally {
      setEnviando(false);
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
            <Link to="/cadastrar-unidade" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Gestão da Rede</Link>
            <Link to="/gestao-profissionais" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Gestão de Profissionais</Link>
            <Link to="/relatorios" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Relatórios</Link>
            <Link to="/configuracoes" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Configurações</Link>
          </nav>
        </div>

        <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 px-4 py-3 font-medium text-sm transition">
          Sair
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-10">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cadastrar Unidade de Atendimento</h1>
            <p className="text-xs text-slate-500">Gestão da Rede</p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-purple-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
              MS
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-slate-800">Marina Souza</p>
              <p className="text-slate-400">Administradora</p>
            </div>
          </div>
        </header>

        {/* Formulário */}
        <section className="bg-white max-w-3xl rounded-2xl border border-purple-100 shadow-sm p-6 md:p-8">
          <h2 className="text-sm font-bold text-slate-900 mb-6">Dados da unidade</h2>

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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da unidade*</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo*</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Endereço*</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Horário de funcionamento</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacidade / vagas</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vagas disponíveis</label>
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
                  Se ficar em branco, usaremos o total informado.
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={enviando}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-6 py-2.5 rounded-xl shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                Salvar
              </button>
              <button type="button" className="bg-white hover:bg-slate-100 text-slate-600 font-medium text-xs px-6 py-2.5 rounded-xl border border-slate-200 transition">
                Cancelar
              </button>
            </div>
          </form>
        </section>

      </main>
    </div>
  );
}