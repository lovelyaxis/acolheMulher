import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Search,
  Handshake,
  MapPin,
  ShieldCheck,
  Lock,
  EyeOff,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function ComoFunciona() {
  const passos = [
    {
      numero: '01',
      titulo: 'Acesse e Explore a Rede',
      descricao:
        'Navegue pelo site sem necessidade de cadastro inicial para consultar os pontos de apoio, delegacias, abrigos e centros assistenciais mais próximos.',
      destaque: 'Sem necessidade de login',
      icone: Search,
    },
    {
      numero: '02',
      titulo: 'Identifique o Tipo de Ajuda',
      descricao:
        'Escolha o tipo de suporte necessário: acolhimento psicológico, orientação jurídica, abrigo temporário ou apoio social emergencial.',
      destaque: 'Atendimento especializado',
      icone: Handshake,
    },
    {
      numero: '03',
      titulo: 'Entre em Contato ou Visite',
      descricao:
        'Veja os horários de funcionamento, telefone e endereço direto de cada unidade cadastrada para receber atendimento humanizado e seguro.',
      destaque: 'Informações atualizadas',
      icone: MapPin,
    },
    {
      numero: '04',
      titulo: 'Acompanhamento Integrado',
      descricao:
        'Os profissionais da rede cadastrados utilizam a plataforma para encaminhar e acompanhar casos em total sigilo e proteção.',
      destaque: 'Rede conectada',
      icone: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 space-y-12">
        {/* Cabeçalho da Página */}
        <section className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-4">
            <Sparkles size={14} />
            Guia Rápido
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Como Funciona o <span className="text-purple-700">AcolheMulher</span>?
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Entenda como a nossa plataforma conecta mulheres em situação de vulnerabilidade com a
            rede pública e parceira de proteção de forma simples, confidencial e segura.
          </p>
        </section>

        {/* Grid 2x2 dos Passos */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {passos.map((p) => {
            const Icone = p.icone;
            return (
              <div
                key={p.numero}
                className="group relative overflow-hidden bg-white p-7 md:p-8 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Número grande decorativo ao fundo */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute -right-2 -top-4 text-7xl font-black text-purple-50 group-hover:text-purple-100/80 transition-colors"
                >
                  {p.numero}
                </span>

                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200">
                    <Icone size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <div className="pr-6">
                    <span className="text-[11px] font-extrabold text-purple-600 tracking-wider uppercase mb-1 block">
                      Passo {p.numero}
                    </span>
                    <h2 className="text-base md:text-lg font-bold text-slate-900 mb-2">
                      {p.titulo}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                      {p.descricao}
                    </p>
                  </div>
                </div>

                {/* Rodapé sutil do card */}
                <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    {p.destaque}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Faixa de Garantias de Segurança */}
        <section className="bg-white rounded-3xl border border-purple-100 p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex items-start gap-3.5 pt-2 md:pt-0">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <EyeOff size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Consulta Livre</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Nenhum dado pessoal é exigido para buscar unidades e telefones de ajuda.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 md:pt-0 md:pl-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sigilo Absoluto</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Encaminhamentos e registros são restritos apenas aos profissionais autorizados.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 md:pt-0 md:pl-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Saída Rápida (3x ESC)</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Aperte ESC três vezes ou clique no botão superior para fechar o site na hora.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chamada para ação */}
        <section className="bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-3xl p-8 md:p-10 text-center shadow-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Precisa consultar a rede agora?</h2>
          <p className="text-xs md:text-sm text-purple-100 max-w-xl mx-auto mb-7 leading-relaxed">
            Localize as unidades de atendimento mais próximas da sua região com endereços, contatos
            e horários de funcionamento.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/rede-de-atendimento"
              className="inline-flex items-center gap-2 bg-white text-purple-700 hover:bg-purple-50 font-bold text-xs md:text-sm px-6 py-3.5 rounded-full shadow-sm transition"
            >
              Ver Rede de Atendimento
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/tipos-de-acolhimento"
              className="inline-flex items-center gap-2 bg-purple-800/50 hover:bg-purple-800/80 text-white border border-purple-400/50 font-semibold text-xs md:text-sm px-6 py-3.5 rounded-full transition"
            >
              Conhecer Tipos de Acolhimento
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}