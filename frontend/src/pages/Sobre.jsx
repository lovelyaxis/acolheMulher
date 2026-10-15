import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Sobre() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12">
                {/* Seção Principal */}
                <section className="bg-white rounded-3xl border border-purple-100 p-8 md:p-12 shadow-sm mb-12">
                    <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-4">
                        Sobre o Projeto
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                        Conectando mulheres a redes de proteção, acolhimento e garantia de direitos.
                    </h1>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        O <strong>AcolheMulher</strong> é uma plataforma desenvolvida para centralizar, organizar e facilitar o acesso de mulheres em situação de vulnerabilidade ou violência aos serviços de apoio da rede pública e parceira.
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Nosso objetivo é simplificar o caminho entre a necessidade de ajuda e o atendimento humanizado, permitindo também que profissionais de assistência social, saúde e segurança trabalhem de forma conectada e eficiente.
                    </p>
                </section>

                {/* Nossos Pilares */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm text-center">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mx-auto mb-4 text-xl">
                            🎯
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-2">Missão</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Garantir acesso rápido, seguro e desburocratizado a serviços essenciais de proteção e apoio.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm text-center">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mx-auto mb-4 text-xl">
                            👁️
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-2">Visão</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Ser referência no fortalecimento e na integração digital das redes de acolhimento à mulher.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm text-center">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mx-auto mb-4 text-xl">
                            💜
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-2">Valores</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Respeito, empatia, confidencialidade, segurança e integração comunitária.
                        </p>
                        <nav className="space-y-2 text-sm font-medium">
                            <Link to="/cadastrar-unidade" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Gestão da Rede</Link>
                            <Link to="/gestao-profissionais" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Gestão de Profissionais</Link>
                            <Link to="/relatorios" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Relatórios</Link>
                            <Link to="/configuracoes" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Configurações</Link>
                        </nav>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}