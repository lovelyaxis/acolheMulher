import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-navy pt-16 text-[#B9B3D9]">
      <div className="mx-auto grid grid-cols-2 gap-8 px-6 pb-12 md:grid-cols-5 md:px-8">
        {/* Marca */}
        <div className="col-span-2 flex flex-col gap-2.5 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8C5AC4]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21C12 21 4 16 4 10.5C4 7.5 6.2 5 9 5C10.5 5 11.8 5.8 12 7C12.2 5.8 13.5 5 15 5C17.8 5 20 7.5 20 10.5C20 16 12 21 12 21Z" />
              </svg>
            </span>
            <span className="font-bold text-white">AcolheMulher</span>
          </div>
          <p className="text-xs">Você não está sozinha</p>
        </div>

        {/* Links úteis */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-white">Links úteis</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/" className="hover:text-white">Início</Link></li>
            <li><Link to="/como-funciona" className="hover:text-white">Como funciona</Link></li>
            <li><Link to="/tipos-de-acolhimento" className="hover:text-white">Tipos de atendimento</Link></li>
            <li><Link to="/rede-atendimento" className="hover:text-white">Rede de atendimento</Link></li>
          </ul>
        </div>

        {/* Mais links (heading invisível só pra alinhar com a coluna anterior) */}
        <div>
          <h4 className="invisible mb-4 text-sm font-semibold">Mais</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/sobre" className="hover:text-white">Sobre</Link></li>
            <li><Link to="/ajuda" className="hover:text-white">Ajuda</Link></li>
            <li><a href="#" className="hover:text-white">Fale conosco</a></li>
          </ul>
        </div>

        {/* Redes sociais */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-white">Siga nossas redes</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </a>
            <a href="#" aria-label="X (Twitter)" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-7.6 8.7L23.3 22h-6.9l-5.4-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.9 6.3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Frase */}
        {/* <div className="col-span-2 flex items-start justify-start md:col-span-1 md:justify-end">
          <p className="font-serif text-xl italic text-white">
            Juntas somos <br /> mais fortes <span className="text-[#C9A7E3]">♡</span>
          </p>
        </div> */}
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="mx-auto flex  flex-col gap-2 px-6 text-xs sm:flex-row sm:justify-between md:px-8">
          <p>© 2026 AcolheMulher. Todos os direitos reservados.</p>
          <p>Em caso de risco imediato, ligue 190.</p>
        </div>
      </div>
    </footer>
  );
}