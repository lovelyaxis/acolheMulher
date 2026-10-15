import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardAdmin() {
  const dadosGrafico = [
    { mes: 'Abr', altura: 'h-16' },
    { mes: 'Mai', altura: 'h-20' },
    { mes: 'Jun', altura: 'h-14' },
    { mes: 'Jul', altura: 'h-24' },
    { mes: 'Ago', altura: 'h-20' },
    { mes: 'Set', altura: 'h-28' },
  ];

  const atualizacoes = [
    { id: 1, unidade: 'Casa da Mulher Brasileira', acao: 'Cadastrada', statusColor: 'bg-emerald-100 text-emerald-700', data: '11/09/2026' },
    { id: 2, unidade: 'CRAS Vila Nova', acao: 'Editada', statusColor: 'bg-amber-100 text-amber-700', data: '10/09/2026' },
    { id: 3, unidade: 'Delegacia da Mulher (DEAM)', acao: 'Cadastrada', statusColor: 'bg-emerald-100 text-emerald-700', data: '08/09/2026' },
    { id: 4, unidade: 'Abrigo Esperança', acao: 'Inativada', statusColor: 'bg-rose-100 text-rose-700', data: '05/09/2026' },
  ];

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
            <Link to="/dashboard-admin" className="flex items-center gap-3 bg-purple-600 text-white px-4 py-3 rounded-xl transition">Início</Link>
            <Link to="/admin/encaminhamentos" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl transition">Gestão de Encaminhamentos</Link>
            <Link to="/admin/vagas-abrigos" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl transition">Vagas em Abrigos</Link>
            <Link to="/admin/registro-ocorrencias" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl transition">Registro de Ocorrências</Link>
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
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Administrativo</h1>
            <p className="text-xs text-slate-500">Visão geral da rede de atendimento</p>
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

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
            <span className="text-3xl font-extrabold text-slate-900">24</span>
            <p className="text-xs text-slate-500 mt-1">Unidades cadastradas</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
            <span className="text-3xl font-extrabold text-slate-900">37</span>
            <p className="text-xs text-slate-500 mt-1">Profissionais ativos</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
            <span className="text-3xl font-extrabold text-slate-900">312</span>
            <p className="text-xs text-slate-500 mt-1">Atendimentos no mês</p>
          </div>
        </div>

        {/* Gráfico de Barras */}
        <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 mb-8">
          <h2 className="text-sm font-bold text-slate-900 mb-6">Atendimentos por mês</h2>
          <div className="flex items-end justify-between gap-4 h-36 px-4 pb-2 border-b border-slate-100">
            {dadosGrafico.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-full max-w-[36px] bg-purple-600 rounded-t-lg ${item.altura}`} />
                <span className="text-xs text-slate-400">{item.mes}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tabela */}
        <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-6">Últimas atualizações na rede</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Unidade</th>
                  <th className="pb-3 font-semibold text-center">Ação</th>
                  <th className="pb-3 font-semibold text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {atualizacoes.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50/30 transition">
                    <td className="py-4 font-medium text-slate-800">{item.unidade}</td>
                    <td className="py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${item.statusColor}`}>
                        {item.acao}
                      </span>
                    </td>
                    <td className="py-4 text-right text-slate-500">{item.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}