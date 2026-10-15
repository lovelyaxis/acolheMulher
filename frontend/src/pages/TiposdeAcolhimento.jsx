import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TiposDeAcolhimento() {
  const tipos = [
    {
      titulo: 'Acolhimento Psicológico',
      descricao: 'Atendimento e escuta qualificada por profissionais de psicologia, oferecendo suporte emocional e fortalecimento para mulheres em situação de vulnerabilidade ou violência.',
      icone: '🧠',
      tag: 'Saúde & Emocional'
    },
    {
      titulo: 'Assistência Jurídica',
      descricao: 'Orientação e acompanhamento legal com advogadas e defensoras públicas para garantia de direitos, medidas protetivas de urgência e processos de família.',
      icone: '⚖️',
      tag: 'Direitos & Proteção'
    },
    {
      titulo: 'Apoio Social e Assistencial',
      descricao: 'Atendimento via CRAS/CREAS para inclusão em programas sociais, auxílios emergenciais e encaminhamento para serviços da rede pública.',
      icone: '🤝',
      tag: 'Assistência Social'
    },
    {
      titulo: 'Casas de Acolhimento e Abrigos',
      descricao: 'Locais seguros de moradia provisória e proteção integral para mulheres e seus dependentes em risco iminente de violência.',
      icone: '🏠',
      tag: 'Moradia Provisória'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        {/* Banner / Cabeçalho */}
        <section className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-3">
            Rede de Proteção
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Tipos de Acolhimento
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Conheça as diferentes formas de apoio disponíveis na rede. Cada serviço é especializado para oferecer atendimento seguro, humanizado e gratuito.
          </p>
        </section>

        {/* Grid dos Tipos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tipos.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 md:p-8 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icone}</span>
                  <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.titulo}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {item.descricao}
                </p>
              </div>

              <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs py-2.5 rounded-xl border border-purple-200 transition">
                Saiba como acessar este serviço
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}