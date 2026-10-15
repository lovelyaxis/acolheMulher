import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search, Handshake, MapPin, ShieldCheck } from 'lucide-react';

export default function ComoFunciona() {
  const passos = [
    {
      numero: '01',
      titulo: 'Acesse e Explore a Rede',
      descricao: 'Navegue pelo site sem necessidade de cadastro inicial para consultar os pontos de apoio, delegacias, abrigos e centros assistenciais mais próximos.',
      icone: Search
    },
    {
      numero: '02',
      titulo: 'Identifique o Tipo de Ajuda',
      descricao: 'Escolha o tipo de suporte necessário: acolhimento psicológico, orientação jurídica, abrigo temporário ou apoio social emergencial.',
      icone: Handshake
    },
    {
      numero: '03',
      titulo: 'Entre em Contato ou Visite',
      descricao: 'Veja os horários de funcionamento, telefone e endereço direto de cada unidade cadastrada para receber atendimento humanizado e seguro.',
      icone: MapPin
    },
    {
      numero: '04',
      titulo: 'Acompanhamento Integrado',
      descricao: 'Os profissionais da rede cadastrados utilizam a plataforma para encaminhar e acompanhar casos em total sigilo e proteção.',
      icone: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12">
        {/* Banner principal */}
        <section className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-3">
            Guia Rápido
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Como Funciona o AcolheMulher?
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Entenda como a nossa plataforma conecta mulheres em situação de vulnerabilidade com a rede pública e parceira de proteção de forma simples, confidencial e segura.
          </p>
        </section>

        {/* Passos do processo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {passos.map((p, idx) => (
            <div 
              key={idx}
              className="bg-white p-6 md:p-8 rounded-2xl border border-purple-100 shadow-sm flex gap-5 items-start hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <p.icone size={24} strokeWidth={1.8} aria-hidden="true" />
              </div>
              
              <div>
                <span className="text-xs font-extrabold text-purple-600 tracking-wider uppercase mb-1 block">
                  Passo {p.numero}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{p.titulo}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chamada para ação */}
        <section className="bg-purple-600 text-white rounded-3xl p-8 md:p-10 text-center shadow-md">
          <h2 className="text-2xl font-bold mb-3">Precisa consultar a rede agora?</h2>
          <p className="text-xs text-purple-100 max-w-xl mx-auto mb-6 leading-relaxed">
            Localize as unidades de atendimento mais próximas da sua região com endereços, contatos e horários de funcionamento.
          </p>
          <Link 
            to="/rede-de-atendimento" 
            className="inline-block bg-white text-purple-700 hover:bg-purple-50 font-bold text-xs px-6 py-3 rounded-xl shadow transition"
          >
            Ver Rede de Atendimento
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}