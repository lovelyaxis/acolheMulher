import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Ajuda() {
    const [faqAberto, setFaqAberto] = useState(null);

    const faqs = [
        {
            pergunta: 'O atendimento através do site é gratuito?',
            resposta: 'Sim, todos os serviços e direcionamentos oferecidos pelo AcolheMulher e pela rede pública parceira são 100% gratuitos.'
        },
        {
            pergunta: 'Como sei qual unidade de atendimento devo procurar?',
            resposta: 'Na nossa página "Rede de Atendimento", você pode filtrar os locais pelo tipo de serviço necessário ou pela cidade/bairro mais próximo de você.'
        },
        {
            pergunta: 'Os meus dados e depoimentos ficam em sigilo?',
            resposta: 'Com certeza. A privacidade e o sigilo de informações das usuárias são prioridades absolutas na nossa plataforma.'
        },
        {
            pergunta: 'O que fazer em caso de emergência ou risco imediato?',
            resposta: 'Caso você ou alguém conhecido esteja em perigo imediato, ligue diretamente para a Polícia Militar (190) ou para o Central de Atendimento à Mulher (180).'
        }
    ];

    const toggleFaq = (idx) => {
        setFaqAberto(faqAberto === idx ? null : idx);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12">

                {/* Banner Emergência */}
                <section className="bg-rose-50 border border-rose-200 rounded-3xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full mb-2">
                            Emergência
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">Precisa de ajuda imediata?</h2>
                        <p className="text-xs text-slate-600">Ligue para os canais de atendimento gratuito e 24 horas.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <a href="tel:180" className="flex-1 md:flex-none text-center bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition">
                            Ligue 180 (Central da Mulher)
                        </a>
                        <a href="tel:190" className="flex-1 md:flex-none text-center bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition">
                            Ligue 190 (Polícia Militar)
                        </a>
                    </div>
                </section>

                {/* FAQ - Perguntas Frequentes */}
                <section className="bg-white rounded-3xl border border-purple-100 p-6 md:p-10 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Perguntas Frequentes</h2>
                    <p className="text-xs text-slate-500 mb-8">Tire suas dúvidas sobre o funcionamento da plataforma e dos serviços de acolhimento.</p>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-slate-200 rounded-2xl overflow-hidden transition"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full text-left p-4 md:p-5 font-semibold text-slate-800 text-xs md:text-sm flex justify-between items-center hover:bg-purple-50/50 transition"
                                >
                                    <span>{faq.pergunta}</span>
                                    <span className="text-purple-600 font-bold ml-2">
                                        {faqAberto === idx ? '−' : '+'}
                                    </span>
                                </button>
                                {faqAberto === idx && (
                                    <div className="px-4 pb-5 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-purple-50/20 leading-relaxed">
                                        {faq.resposta}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <nav className="space-y-2 text-sm font-medium">
                        <Link to="/dashboard-admin" className="flex items-center gap-3 bg-purple-600 text-white px-4 py-3 rounded-xl transition">Início</Link>
                        <Link to="/cadastrar-unidade" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Gestão da Rede</Link>
                        <Link to="/gestao-profissionais" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Gestão de Profissionais</Link>
                        <Link to="/relatorios" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Relatórios</Link>
                        <Link to="/configuracoes" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Configurações</Link>
                    </nav>
                </section>

            </main>

            <Footer />
        </div>
    );
}