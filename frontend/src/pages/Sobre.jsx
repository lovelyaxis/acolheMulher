import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Target, Eye, HeartHandshake, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 space-y-10">
        {/* Seção Principal */}
        <section className="bg-white rounded-3xl border border-purple-100 p-8 md:p-12 shadow-sm">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-4">
            Sobre o Projeto
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
            Conectando mulheres a redes de proteção, acolhimento e garantia de direitos.
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            O <strong>AcolheMulher</strong> é uma plataforma desenvolvida para centralizar, organizar e facilitar o acesso de mulheres em situação de vulnerabilidade ou violência aos serviços de apoio da rede pública e parceira.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Nosso objetivo é simplificar o caminho entre a necessidade de ajuda e o atendimento humanizado, permitindo também que profissionais de assistência social, saúde e segurança trabalhem de forma conectada e eficiente.
          </p>
        </section>

        {/* Nossos Pilares (limpos e nivelados) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mx-auto mb-4 text-xl">
              <Target size={24} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Missão</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Garantir acesso rápido, seguro e desburocratizado a serviços essenciais de proteção e apoio.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mx-auto mb-4 text-xl">
              <Eye size={24} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Visão</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ser referência no fortalecimento e na integração digital das redes de acolhimento à mulher.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mx-auto mb-4 text-xl">
              <HeartHandshake size={24} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Valores</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Respeito, empatia, confidencialidade, segurança e integração comunitária.
            </p>
          </div>
        </section>

        {/* Como a plataforma atua na prática */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <ShieldCheck size={20} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 block">
                  Para quem busca apoio
                </span>
                <h2 className="font-bold text-slate-900 text-base">Acesso seguro e orientação</h2>
              </div>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <span>Busca rápida por delegacias, CRAS, CREAS, centros de referência e casas-abrigo.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <span>Orientações claras sobre tipos de acolhimento e canais de emergência 24h.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <span>Botão de Saída Rápida para navegação discreta e proteção da privacidade.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Building2 size={20} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 block">
                  Para profissionais da rede
                </span>
                <h2 className="font-bold text-slate-900 text-base">Gestão integrada do atendimento</h2>
              </div>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <span>Acompanhamento estruturado de encaminhamentos e registro de ocorrências.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <span>Monitoramento atualizado da disponibilidade de vagas em abrigos.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <span>Cadastro e atualização centralizada das unidades e equipes parceiras.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Chamada para Ação */}
        <section className="bg-purple-700 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">Precisa de atendimento ou orientação?</h2>
            <p className="text-purple-100 text-xs md:text-sm">
              Consulte as unidades disponíveis perto de você ou acesse os canais de ajuda imediata.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/rede-atendimento"
              className="bg-white text-purple-700 hover:bg-purple-50 font-semibold text-xs md:text-sm px-5 py-3 rounded-full transition"
            >
              Ver Rede de Atendimento
            </Link>
            <Link
              to="/ajuda"
              className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 font-semibold text-xs md:text-sm px-5 py-3 rounded-full transition"
            >
              Canais de Ajuda
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}