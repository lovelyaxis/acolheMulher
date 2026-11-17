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
    <aside className="flex w-64 flex-col justify-between border-r border-line bg-white p-6 text-ink hidden md:flex">
      <div>
        <div className="flex items-center gap-2 mb-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soft font-semibold text-brand">
            ♥
          </div>
          <span className="text-lg font-semibold tracking-wide">AcolheMulher</span>
        </div>

        <nav className="space-y-2 text-sm font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                isActive(item.to)
                  ? 'bg-soft font-semibold text-brand'
                  : 'text-muted hover:bg-page hover:text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Sair
      </button>
    </aside>
  );
}
