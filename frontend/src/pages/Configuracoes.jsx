import React from 'react';
import Sidebar from '../components/Sidebar';

export default function Configuracoes() {
  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      <Sidebar activePath="/configuracoes" />

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Configurações do Sistema</h1>
          <p className="text-xs text-slate-500">Ajustes da conta e preferências de administração</p>
        </header>

        <section className="bg-white max-w-2xl rounded-2xl border border-purple-100 shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Dados da Conta</h3>
            <p className="text-xs text-slate-500 mb-4">Atualize as suas informações de perfil administrativo.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input type="text" defaultValue="Marina Souza" className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail de Acesso</label>
                <input type="email" defaultValue="marina.souza@acolhemulher.org" className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-6 py-2.5 rounded-xl shadow-sm transition">
              Guardar Alterações
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
