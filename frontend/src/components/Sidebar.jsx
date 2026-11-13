import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Sidebar({ activePath }) {
  const { usuario } = useAuth();
  const menuItems = [
    { to: '/dashboard-admin', label: 'Início' },
    { to: '/admin/encaminhamentos', label: 'Gestão de Encaminhamentos' },
    { to: '/admin/vagas-abrigos', label: 'Vagas em Abrigos' },
    { to: '/admin/registro-ocorrencias', label: 'Registro de Ocorrências' },
    { to: '/cadastrar-unidade', label: 'Cadastrar Unidade' },
    { to: '/admin/unidades', label: 'Gerenciar Unidades' },
    ...(usuario?.perfil === 'ADMINISTRADOR'
      ? [{ to: '/gestao-profissionais', label: 'Gestão de Profissionais' }]
      : []),
  ];

  const isActive = (to) => activePath === to;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 hidden md:flex">
      <div>
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">
            ♥
          </div>
          <span className="font-bold text-lg tracking-wide">AcolheMulher</span>
        </div>

        <nav className="space-y-2 text-sm font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive(item.to)
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="flex items-center gap-3 text-slate-400 hover:text-red-400 px-4 py-3 font-medium text-sm transition"
      >
        Sair
      </button>
    </aside>
  );
}
