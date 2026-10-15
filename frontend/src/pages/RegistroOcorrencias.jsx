// frontend/src/pages/RegistroOcorrencias.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function RegistroOcorrencias() {
  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 hidden md:flex">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">♥</div>
            <span className="font-bold text-lg tracking-wide">AcolheMulher</span>
          </div>
          <nav className="space-y-2 text-sm font-medium">
            <Link to="/dashboard-admin" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl transition">Início</Link>
            <Link to="/admin/encaminhamentos" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl transition">Gestão de Encaminhamentos</Link>
            <Link to="/admin/vagas-abrigos" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl transition">Vagas em Abrigos</Link>
            <Link to="/admin/registro-ocorrencias" className="flex items-center gap-3 bg-purple-600 text-white px-4 py-3 rounded-xl transition">Registro de Ocorrências</Link>
          </nav>
        </div>
      </aside>

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