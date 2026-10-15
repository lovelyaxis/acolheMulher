import React from 'react';

export default function GestaoProfissionais() {
  const profissionais = [
    { id: 1, nome: 'Dra. Camila Mendes', cargo: 'Psicóloga', unidade: 'Casa da Mulher Brasileira', status: 'Ativo' },
    { id: 2, nome: 'Juliana Ribeiro', cargo: 'Assistente Social', unidade: 'CRAS Vila Nova', status: 'Ativo' },
    { id: 3, nome: 'Fernanda Lima', cargo: 'Advogada', unidade: 'Delegacia da Mulher (DEAM)', status: 'Férias' },
    { id: 4, nome: 'Carla Souza', cargo: 'Recepcionista / Triagem', unidade: 'Abrigo Esperança', status: 'Ativo' },
  ];

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
            <a href="/gestao-profissionais" className="flex items-center gap-3 bg-purple-600 text-white px-4 py-3 rounded-xl transition">Gestão de Profissionais</a>
            <a href="/relatorios" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Relatórios</a>
            <a href="/configuracoes" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-xl transition">Configurações</a>
          </nav>
        </div>

        <a href="/login" className="flex items-center gap-3 text-slate-400 hover:text-red-400 px-4 py-3 font-medium text-sm transition">
          Sair
        </a>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Profissionais</h1>
            <p className="text-xs text-slate-500">Equipa e colaboradores da rede de apoio</p>
          </div>

          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-sm transition">
            + Novo Profissional
          </button>
        </header>

        {/* Tabela */}
        <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-6">Profissionais cadastrados</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Nome</th>
                  <th className="pb-3 font-semibold">Cargo / Função</th>
                  <th className="pb-3 font-semibold">Unidade Vinculada</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {profissionais.map((p) => (
                  <tr key={p.id} className="hover:bg-purple-50/30 transition">
                    <td className="py-4 font-medium text-slate-800">{p.nome}</td>
                    <td className="py-4 text-slate-600">{p.cargo}</td>
                    <td className="py-4 text-slate-600">{p.unidade}</td>
                    <td className="py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${p.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-purple-600 hover:text-purple-800 font-semibold mr-3">Editar</button>
                      <button className="text-rose-500 hover:text-rose-700 font-semibold">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}