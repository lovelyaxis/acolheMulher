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

    const pilaresApoio = [
        {
            titulo: 'Simplicidade e Clareza',
            descricao: 'Informações diretas e fáceis de entender, para você encontrar orientação sem complicação.'
        },
        {
            titulo: 'Segurança e Sigilo',
            descricao: 'Respeito à privacidade e transparência no cuidado com as informações da usuária.'
        },
        {
            titulo: 'Inclusão e Respeito',
            descricao: 'Acolhimento acessível, humano e livre de julgamentos ou discriminação.'
        }
    ];

    const toggleFaq = (idx) => {
        setFaqAberto(faqAberto === idx ? null : idx);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 space-y-10">

                {/* Cabeçalho da Página */}
                <section className="text-center max-w-2xl mx-auto">
                    <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-3">
                        Central de Suporte
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                        Como podemos te <span className="text-purple-700">ajudar</span>?
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                        Tire suas dúvidas, conheça nossos canais de segurança e saiba como acessar a rede de apoio.
                    </p>
                </section>

                {/* Banner Emergência */}
                <section className="bg-rose-50 border border-rose-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full mb-2">
                            Emergência
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">Precisa de ajuda imediata?</h2>
                        <p className="text-xs md:text-sm text-slate-600">Ligue para os canais de atendimento gratuito e 24 horas.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <a href="tel:180" className="flex-1 md:flex-none text-center bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition">
                            Ligue 180 (Central da Mulher)
                        </a>
                        <a href="tel:190" className="flex-1 md:flex-none text-center bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition">
                            Ligue 190 (Polícia Militar)
                        </a>
                    </div>
                </section>

                {/* Clareza, Segurança e Inclusão */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pilaresApoio.map((item) => (
                        <div
                            key={item.titulo}
                            className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm"
                        >
                            <h2 className="text-sm font-bold text-slate-900 mb-1.5">
                                {item.titulo}
                            </h2>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {item.descricao}
                            </p>
                        </div>
                    ))}
                </section>

                {/* FAQ - Perguntas Frequentes */}
                <section className="bg-white rounded-3xl border border-purple-100 p-6 md:p-10 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Perguntas Frequentes</h2>
                    <p className="text-xs md:text-sm text-slate-500 mb-8">Tire suas dúvidas sobre o funcionamento da plataforma e dos serviços de acolhimento.</p>

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
                                    <span className="text-purple-600 font-bold ml-2 text-base">
                                        {faqAberto === idx ? '−' : '+'}
                                    </span>
                                </button>
                                {faqAberto === idx && (
                                    <div className="px-4 pb-5 pt-1 text-xs md:text-sm text-slate-600 border-t border-slate-100 bg-purple-50/20 leading-relaxed">
                                        {faq.resposta}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Link para Rede de Atendimento */}
                <section className="bg-purple-50 border border-purple-100 rounded-3xl p-6 md:p-8 text-center flex flex-col items-center">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">Precisa encontrar um local de apoio presencial?</h3>
                    <p className="text-xs md:text-sm text-slate-600 max-w-md mb-5">
                        Consulte nossa página de unidades parceiras cadastradas na sua região.
                    </p>
                    <Link 
                        to="/rede-de-atendimento" 
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs md:text-sm px-6 py-3 rounded-xl shadow-sm transition"
                    >
                        Ver Rede de Atendimento
                    </Link>
                </section>

            </main>

            <Footer />
        </div>
    );
}