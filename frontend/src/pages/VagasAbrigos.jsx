// frontend/src/pages/VagasAbrigos.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

export default function VagasAbrigos() {
  const abrigos = [
    { nome: 'Casa de Acolhimento Rosa Viva', capacidade: 20, ocupadas: 14, disponiveis: 6, cidade: 'São Paulo - SP' },
    { nome: 'Abrigo Proteção & Vida', capacidade: 15, ocupadas: 15, disponiveis: 0, cidade: 'Campinas - SP' },
    { nome: 'Centro de Acolhimento Esperança', capacidade: 30, ocupadas: 18, disponiveis: 12, cidade: 'Santos - SP' },
  ];

  const totalVagas = abrigos.reduce((soma, a) => soma + a.capacidade, 0);
  const totalLivres = abrigos.reduce((soma, a) => soma + a.disponiveis, 0);

  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      <Sidebar activePath="/admin/vagas-abrigos" />

      <main className="flex-1 p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Monitoramento de Vagas em Abrigos</h1>
          <p className="text-xs text-slate-500 mt-1">Disponibilidade de leitos temporários na rede credenciada</p>
        </div>

        {/* Resumo rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm">
            <p className="text-xs text-slate-400">Abrigos Cadastrados</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{abrigos.length}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm">
            <p className="text-xs text-slate-400">Capacidade Total</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalVagas} vagas</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm">
            <p className="text-xs text-slate-400">Vagas Disponíveis</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{totalLivres} vagas</p>
          </div>
        </div>

        {/* Lista de Abrigos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {abrigos.map((a, i) => {
            const porcentagem = Math.round((a.ocupadas / a.capacidade) * 100);
            const lotado = a.disponiveis === 0;

            return (
              <div key={i} className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-sm">{a.nome}</h3>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      lotado ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {lotado ? 'Lotado' : 'Disponível'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-5">{a.cidade}</p>

                {/* Barra de ocupação */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full ${lotado ? 'bg-red-500' : 'bg-purple-600'}`}
                    style={{ width: `${porcentagem}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Ocupação:</span>
                    <span className="font-bold">{a.ocupadas}/{a.capacidade} ({porcentagem}%)</span>
                  </div>
                  <div className="flex justify-between text-purple-700 font-bold">
                    <span>Vagas Livres:</span>
                    <span>{a.disponiveis}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
