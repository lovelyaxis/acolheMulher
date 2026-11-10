import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink ,Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo-acolhemulher.png"
import { useAuth } from "../auth/AuthContext";

const URL_SAIDA_RAPIDA = "https://www.google.com.br";
// Mesma chave de sessão definida em src/auth/authService.js (CHAVE_SESSION).
const CHAVE_SESSAO = "am_session";

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
            // Remove apenas a sessão. am_tentativas e am_bloqueado_ate permanecem
            // para preservar o bloqueio de login da RN005.
            localStorage.removeItem(CHAVE_SESSAO);
            sessionStorage.clear();
        } finally {
            window.location.replace(URL_SAIDA_RAPIDA);
        }
    }, []);

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
        <header className='sticky top-0 z-50 border-b border-[#E7E1F5] bg-white font-inter'>
            <div className='mx-auto flex max-w-[1200] items-center gap-6 px-6 py-4 md:px-8 font-inter'>
                {/* logo paezão */}

                <Link to='/' className='flex shrink-0 items-center gap-2.5 font-inter'>
                <img src={logo} alt="logo acolhe mulher" className='h-10 w-auto font-inter'/>

                <span className='hidden flex-col leading-tight font-inter sm:flex'>
                    <span className='text-lg font-bold text-navy font-inter'>
                    AcolheMulher
                    </span>
                </span>
                </Link>

                        {/* Navegação (desktop) */}
        <nav className="ml-auto hidden items-center gap-7 md:flex font-inter">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `border-b-2 pb-1 text-sm font-medium font-inter ${
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
        <div className="hidden items-center gap-3 md:flex font-inter">
          <button
            type="button"
            onClick={acionarSaidaRapida}
            aria-label="Saída rápida: sair deste site imediatamente"
            className="flex items-center gap-2 rounded-full bg-[#F1E9FB] px-5 py-2.5 text-sm font-semibold text-brand hover:bg-[#E6D9F7] font-inter"
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
            className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover font-inter"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Buscar atendimento
          </Link>

          {estaAutenticado ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-xs text-[#5B5770]">
                {usuario?.nome}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-[#DC3B57] hover:bg-[#FCE7EC] font-inter"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-[#7B3FA6] hover:bg-[#F0E5FA] font-inter"
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
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F1E9FB] px-2.5 py-2 text-xs font-semibold text-brand hover:bg-[#E6D9F7] font-inter"
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
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden font-inter"
          >
            <span className={`h-0.5 w-6 bg-navy transition-transform font-inter ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-navy transition-opacity font-inter ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-navy transition-transform font-inter ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Navegação (mobile, só aparece se menuOpen for true) */}
      {menuOpen && (
        <nav className="flex flex-col border-t border-[#E7E1F5] bg-white px-6 py-2 md:hidden font-inter">
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