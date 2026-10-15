import React from 'react';
import { Link } from 'react-router-dom';

export default function Relatorios() {
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

                <a href="/login" className="flex items-center gap-3 text-slate-400 hover:text-red-400 px-4 py-3 font-medium text-sm transition">
                    Sair
                </a>
            </aside>

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