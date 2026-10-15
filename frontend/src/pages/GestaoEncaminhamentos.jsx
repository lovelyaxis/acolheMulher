// frontend/src/pages/GestaoEncaminhamentos.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function GestaoEncaminhamentos() {
  const casos = [
    { id: 'ENC-089', data: '15/10/2026', tipo: 'Acolhimento Emergencial', prioridade: 'Alta', status: 'Em Análise' },
    { id: 'ENC-088', data: '14/10/2026', tipo: 'Apoio Jurídico', prioridade: 'Média', status: 'Concluído' },
    { id: 'ENC-087', data: '14/10/2026', tipo: 'Atendimento Psicológico', prioridade: 'Alta', status: 'Em Cursamento' },
  ];

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
            <Link to="/admin/encaminhamentos" className="flex items-center gap-3 bg-purple-600 text-white px-4 py-3 rounded-xl transition">Gestão de Encaminhamentos</Link>
            <Link to="/admin/vagas-abrigos" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl transition">Vagas em Abrigos</Link>
            <Link to="/admin/registro-ocorrencias" className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 rounded-xl transition">Registro de Ocorrências</Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Gestão de Encaminhamentos</h1>
        <p className="text-xs text-slate-500 mb-8">Acompanhamento de solicitações e encaminhamento de assistência</p>

        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-400 uppercase">
                <th className="pb-3">Código</th>
                <th className="pb-3">Data</th>
                <th className="pb-3">Tipo de Apoio</th>
                <th className="pb-3">Prioridade</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {casos.map(c => (
                <tr key={c.id}>
                  <td className="py-3 font-semibold text-slate-800">{c.id}</td>
                  <td className="py-3 text-slate-600">{c.data}</td>
                  <td className="py-3 text-slate-600">{c.tipo}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${c.prioridade === 'Alta' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {c.prioridade}
                    </span>
                  </td>
                  <td className="py-3 text-purple-600 font-medium">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}