import React from 'react';
import Sidebar from '../components/Sidebar';

export default function Relatorios() {
  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      <Sidebar activePath="/relatorios" />

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Relatórios e Estatísticas</h1>
          <p className="text-xs text-slate-500">Geração de dados e histórico de atendimentos</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Relatório de Atendimentos Mensais</h3>
            <p className="text-xs text-slate-500 mb-6">Consolidado com o volume total de acolhimentos realizados em todas as unidades da rede.</p>
            <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs px-4 py-2.5 rounded-xl border border-purple-200 transition">
              Descarregar PDF / CSV
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Relatório de Ocupação de Acolhimentos</h3>
            <p className="text-xs text-slate-500 mb-6">Mapeamento de vagas disponíveis e taxa de ocupação das casas de abrigo.</p>
            <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs px-4 py-2.5 rounded-xl border border-purple-200 transition">
              Descarregar PDF / CSV
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
