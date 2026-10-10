import {useState} from 'react';
import { NavLink ,Link } from 'react-router-dom';
import logo from "../assets/logo-acolhemulher.png"



const navItems = [
    {to: '/', label: 'Home'},
    {to: '/como-funciona', label: 'Como Funciona'},
    {to: '/tipos-de-acolhimento', label: 'Tipos de Acolhimento'},
    {to: '/rede-de-atendimento', label: 'Rede de Atendimento'},
    {to: '/sobre', label: 'Sobre'},
    {to: '/ajuda', label: 'Ajuda'},
]
export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    
    return (
        <header className='sticky top-0 z-50 border-b border-[#E7E1F5] bg-white'>
            <div className='mx-auto flex max-w-[1200] items-center gap-6 px-6 py-4 md:px-8'>
                {/* logo paezão */}

                <Link to='/' className='flex shrink-0 items-center gap-2.5'>
                <img src={logo} alt="logo acolhe mulher" className='h-10 w-auto'/>

                <span className='flex flex-col leading-tight'>
                    <span className='text-lg font-bold text-navy'>
                    AcolheMulher
                    </span>
                </span>
                </Link>

                        {/* Navegação (desktop) */}
        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `border-b-2 pb-1 text-sm font-medium ${
                  isActive
                    ? "border-brand font-semibold text-brand"
                    : "border-transparent text-[#5B5770] hover:text-brand"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Botões (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#"
            className="flex items-center gap-2 rounded-full bg-[#F1E9FB] px-5 py-2.5 text-sm font-semibold text-brand hover:bg-[#E6D9F7]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Saída rápida
          </a>
          <Link
            to="/rede-atendimento"
            className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Buscar atendimento
          </Link>
        </div>

        {/* Botão hamburguer (mobile) */}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          className="ml-auto flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-0.5 w-6 bg-navy transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-navy transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-navy transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Navegação (mobile, só aparece se menuOpen for true) */}
      {menuOpen && (
        <nav className="flex flex-col border-t border-[#E7E1F5] bg-white px-6 py-2 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `border-b border-[#E7E1F5] py-3 text-sm font-medium ${
                  isActive ? "font-semibold text-brand" : "text-[#5B5770]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}