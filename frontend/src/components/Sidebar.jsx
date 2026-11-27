import { NavLink, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function Sidebar({ id, aberto = false, aoFechar }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleSair = () => {
    if (logout) logout();
    navigate('/');
  };

  const menuItems = [
    { to: '/dashboard-admin', label: 'Início', end: true },
    { to: '/admin/encaminhamentos', label: 'Gestão de Encaminhamentos' },
    { to: '/admin/vagas-abrigos', label: 'Vagas em Abrigos' },
    { to: '/admin/registro-ocorrencias', label: 'Registro de Ocorrências' },
    { to: '/cadastrar-unidade', label: 'Cadastrar Unidade' },
    { to: '/admin/unidades', label: 'Gerenciar Unidades' },
    ...(usuario?.perfil === 'ADMINISTRADOR'
      ? [{ to: '/gestao-profissionais', label: 'Gestão de Profissionais' }]
      : []),
    { to: '/relatorios', label: 'Relatórios' },
    { to: '/configuracoes', label: 'Configurações' },
  ];

  const classesItem = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
    }`;

  return (
    <aside
      id={id}
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between overflow-y-auto bg-slate-900 p-6 text-white transition-transform duration-200 md:static md:z-auto md:shrink-0 md:translate-x-0 ${
        aberto ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">
              ♥
            </div>
            <span className="font-bold text-lg tracking-wide">AcolheMulher</span>
          </div>

          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar menu"
            className="md:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="space-y-2 text-sm font-medium">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={aoFechar}
              className={classesItem}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        type="button"
        onClick={handleSair}
        className="flex items-center gap-3 text-slate-400 hover:text-red-400 px-4 py-3 font-medium text-sm transition cursor-pointer"
      >
        Sair
      </button>
    </aside>
  );
}
