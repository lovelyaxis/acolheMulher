// frontend/src/pages/RegistroOcorrencias.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

export default function RegistroOcorrencias() {
  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      <Sidebar activePath="/admin/registro-ocorrencias" />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Registro de Ocorrências</h1>
        <p className="text-xs text-slate-500 mb-8">Central de alertas e logs de suporte emergencial</p>

        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm max-w-xl">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Nova Ocorrência</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tipo de Evento</label>
              <select className="w-full p-2.5 bg-slate-50 border rounded-xl">
                <option>Acolhimento de Urgência</option>
                <option>Solicitação de Medida Protetiva</option>
                <option>Orientação Telefônica</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Observações</label>
              <textarea className="w-full p-2.5 bg-slate-50 border rounded-xl h-24" placeholder="Descreva brevemente o atendimento..."></textarea>
            </div>
            <button className="bg-purple-600 text-white font-bold px-5 py-2.5 rounded-xl">Registrar Ocorrência</button>
          </div>
        </div>
      </main>
    </div>
  );
}
