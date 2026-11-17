import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink ,Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo-acolhemulher.png"
import { useAuth } from "../auth/AuthContext";

const URL_SAIDA_RAPIDA = "https://www.google.com.br";

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
    const navigate = useNavigate();
    const { usuario, estaAutenticado, logout } = useAuth();
    const teclasRef = useRef([]);

    const acionarSaidaRapida = useCallback(() => {
        try {
            // Encerra a sessão no contexto e no armazenamento antes de sair.
            logout();
            sessionStorage.clear();
        } finally {
            window.location.replace(URL_SAIDA_RAPIDA);
        }
    }, [logout]);

    function handleSair() {
        logout();
        setMenuOpen(false);
        navigate("/login");
    }

    useEffect(() => {
        function aoPressionar(evento) {
            if (evento.key !== "Escape" || evento.repeat) return;

            const agora = Date.now();
            teclasRef.current = [
                ...teclasRef.current.filter((t) => agora - t <= 2000),
                agora,
            ];

            if (teclasRef.current.length >= 3) {
                teclasRef.current = [];
                acionarSaidaRapida();
            }
        }

        window.addEventListener("keydown", aoPressionar, true);
        return () => window.removeEventListener("keydown", aoPressionar, true);
    }, [acionarSaidaRapida]);

    return (
        <header className='sticky top-0 z-50 border-b border-line bg-white'>
            <div className='mx-auto flex max-w-[1200] items-center gap-6 px-6 py-4 md:px-8'>
                {/* logo paezão */}

                <Link to='/' className='flex shrink-0 items-center gap-2.5'>
                <img src={logo} alt="logo acolhe mulher" className='h-10 w-auto'/>

                <span className='hidden flex-col leading-tight sm:flex'>
                    <span className='text-lg font-semibold text-ink'>
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
                    ? "border-brand/40 font-semibold text-brand"
                    : "border-transparent text-muted hover:text-brand"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Botões (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={acionarSaidaRapida}
            aria-label="Saída rápida: sair deste site imediatamente"
            className="flex items-center gap-2 rounded-xl bg-soft px-5 py-2.5 text-sm font-semibold text-brand hover:bg-purple-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Saída rápida
          </button>
          <Link
            to="/rede-de-atendimento"
            className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Buscar atendimento
          </Link>

          {estaAutenticado ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-xs text-muted">
                {usuario?.nome}
              </span>
              <button
                type="button"
                onClick={handleSair}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-brand hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Saída rápida e botão hamburguer (mobile) */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={acionarSaidaRapida}
            aria-label="Saída rápida: sair deste site imediatamente"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-soft px-2.5 py-2 text-xs font-semibold text-brand hover:bg-purple-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Saída rápida
          </button>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <span className={`h-0.5 w-6 bg-ink transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-ink transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Navegação (mobile, só aparece se menuOpen for true) */}
      {menuOpen && (
        <nav className="flex flex-col border-t border-line bg-white px-6 py-2 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `border-b border-line py-3 text-sm font-medium ${
                  isActive ? "font-semibold text-brand" : "text-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {estaAutenticado ? (
            <button
              type="button"
              onClick={handleSair}
              className="border-b border-line py-3 text-left text-sm font-semibold text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Sair
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="border-b border-line py-3 text-sm font-semibold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Entrar
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}