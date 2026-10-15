import React from 'react';

export default function Configuracoes() {
  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 hidden md:flex">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">
              ♥
            </div>
            <span className="font-bold text-lg tracking-wide">AcolheMulher</span>
          </div>

          <nav className="space-y-2 text-sm font-medium">
            <a href="/cadastrar-unidade" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Gestão da Rede</a>
            <a href="/gestao-profissionais" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Gestão de Profissionais</a>
            <a href="/relatorios" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Relatórios</a>
            <a href="/configuracoes" className="flex items-center gap-3 bg-purple-600 text-white px-4 py-3 rounded-xl transition">Configurações</a>
          </nav>
        </div>

        <a href="/login" className="flex items-center gap-3 text-slate-400 hover:text-red-400 px-4 py-3 font-medium text-sm transition">
          Sair
        </a>
      </aside>

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