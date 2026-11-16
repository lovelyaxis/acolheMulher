// frontend/src/pages/VagasAbrigos.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

export default function VagasAbrigos() {
  const abrigos = [
    { nome: 'Casa de Acolhimento Rosa Viva', capacidade: 20, ocupadas: 14, disponiveis: 6, cidade: 'São Paulo - SP' },
    { nome: 'Abrigo Proteção & Vida', capacidade: 15, ocupadas: 15, disponiveis: 0, cidade: 'Campinas - SP' },
    { nome: 'Centro de Acolhimento Esperança', capacidade: 30, ocupadas: 18, disponiveis: 12, cidade: 'Santos - SP' },
  ];

  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      <Sidebar activePath="/admin/vagas-abrigos" />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Monitoramento de Vagas em Abrigos</h1>
        <p className="text-xs text-slate-500 mb-8">Disponibilidade de leitos temporários na rede credenciada</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {abrigos.map((a, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-1">{a.nome}</h3>
              <p className="text-xs text-slate-400 mb-4">{a.cidade}</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600"><span>Ocupação:</span> <span className="font-bold">{a.ocupadas}/{a.capacidade}</span></div>
                <div className="flex justify-between text-purple-700 font-bold"><span>Vagas Livres:</span> <span>{a.disponiveis}</span></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
