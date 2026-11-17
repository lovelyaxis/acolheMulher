import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../auth/AuthContext";
import loginImg from "../assets/login.jpg";

function destinoDoPerfil(perfil) {
  return perfil === "ADMINISTRADOR"
    ? "/dashboard-admin"
    : "/dashboard-profissional";
}

// Aceita o `location` guardado pelo ProtectedRoute e devolve um caminho seguro.
function caminhoDoEstado(destino) {
  if (!destino) return null;

  if (typeof destino === "string") {
    return destino.startsWith("/") && !destino.startsWith("//")
      ? destino
      : null;
  }

  const caminho = `${destino.pathname || ""}${destino.search || ""}${
    destino.hash || ""
  }`;
  return caminho.startsWith("/") && !caminho.startsWith("//")
    ? caminho
    : null;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login: fazerLogin,
    bloqueadoAte,
    tentativasRestantes,
    estaAutenticado,
    perfil,
  } = useAuth();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [minutosBloqueio, setMinutosBloqueio] = useState(0);

  useEffect(() => {
    if (!bloqueadoAte) return;

    const atualizar = () =>
      setMinutosBloqueio(
        Math.max(0, Math.ceil((bloqueadoAte - Date.now()) / 60000)),
      );

    const inicial = setTimeout(atualizar, 0);
    const timer = setInterval(atualizar, 1000);
    return () => {
      clearTimeout(inicial);
      clearInterval(timer);
    };
  }, [bloqueadoAte]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMensagem("");
    setEnviando(true);

    const resultado = await fazerLogin(login, senha);

    setEnviando(false);
    if (resultado.ok) {
      const solicitado = caminhoDoEstado(location.state?.from);
      const destino =
        solicitado && !solicitado.startsWith("/login")
          ? solicitado
          : destinoDoPerfil(resultado.usuario.perfil);
      navigate(destino, { replace: true });
      return;
    }

    if (resultado.codigo === "bloqueado") {
      // A mensagem de bloqueio é exibida pelo estado do contexto.
      setMensagem("");
      return;
    }

    setMensagem(resultado.mensagem || "E-mail ou senha inválidos.");
  }

  const solicitado = caminhoDoEstado(location.state?.from);
  const destinoSolicitado =
    solicitado && !solicitado.startsWith("/login") ? solicitado : null;
  const destinoAutenticado = destinoSolicitado || destinoDoPerfil(perfil);
  const perfilConhecido =
    perfil === "ADMINISTRADOR" || perfil === "PROFISSIONAL";

  // Quem já está autenticado não precisa ver o formulário novamente.
  if (estaAutenticado && perfilConhecido) {
    return <Navigate to={destinoAutenticado} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col font-inter">
      <Header />

      <main className="flex flex-1 items-center bg-linear-to-b from-soft to-white py-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 md:grid-cols-2 md:gap-12">
          {/* Imagem de Login */}
          <div className="hidden justify-center md:flex">
            <img
              src={loginImg}
              alt="Ilustração de boas-vindas"
              className="w-full max-w-xl h-auto object-contain mix-blend-multiply scale-110"
            />
          </div>

          {/* Formulário */}
          <section className="w-full max-w-md justify-self-center rounded-2xl bg-white p-6 shadow-lg sm:p-8 md:justify-self-end">
            <h1 className="font-poppins text-2xl font-bold text-navy">
              Bem-vinda de volta!
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Faça login para acessar sua conta e continuar seu atendimento.
            </p>

            {bloqueadoAte && (
              <p className="text-center text-sm text-[#DC3B57]" role="alert">
                Sua conta está temporariamente bloqueada por várias tentativas
                incorretas. Tente novamente em{" "}
                <strong>{minutosBloqueio} minuto(s)</strong>.
              </p>
            )}
            {!bloqueadoAte && tentativasRestantes < 5 && tentativasRestantes > 0 && (
              <p className="text-center text-sm text-[#827A99]">
                Tentativa{tentativasRestantes === 1 ? "" : "s"} restante(s):
                <strong>{tentativasRestantes}</strong> de 5
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="login"
                  className="mb-1.5 block text-xs font-semibold text-navy"
                >
                  E-mail
                </label>

                <input
                  id="login"
                  name="login"
                  type="email"
                  autoComplete="username"
                  value={login}
                  onChange={(event) => {
                    setLogin(event.target.value);
                    setMensagem("");
                  }}
                  placeholder="Digite seu e-mail"
                  required
                  disabled={bloqueadoAte || enviando}
                  className="w-full rounded-full border border-gray-200 px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="mb-1.5 block text-xs font-semibold text-navy"
                >
                  Senha
                </label>

                <div className="relative">
                  <input
                    id="senha"
                    name="senha"
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="current-password"
                    value={senha}
                    onChange={(event) => {
                      setSenha(event.target.value);
                      setMensagem("");
                    }}
                    placeholder="Digite sua senha"
                    required
                    disabled={bloqueadoAte || enviando}
                    className="w-full rounded-full border border-gray-200 px-4 py-3 pr-12 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha((visivel) => !visivel)}
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={mostrarSenha}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-primary"
                  >
                    {mostrarSenha ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c7 0 11 7 11 7a17.7 17.7 0 0 1-4.1 4.9" />
                        <path d="M6.2 6.2C2.8 8.3 1 12 1 12s4 7 11 7c1.5 0 2.8-.3 4-.8" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                  <input
                    id="lembrar"
                    name="lembrar"
                    type="checkbox"
                    checked={lembrar}
                    onChange={(event) => setLembrar(event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  Lembrar de mim
                </label>
              </div>

              <button
                type="submit"
                disabled={bloqueadoAte || enviando}
                className={`w-full rounded-full py-3 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  bloqueadoAte || enviando
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-hover"
                }`}
              >
                {enviando ? "Entrando..." : "Entrar"}
              </button>

              {mensagem && (
                <p
                  className="text-center text-sm text-[#DC3B57]"
                  role="alert"
                  aria-live="polite"
                >
                  {mensagem}
                </p>
              )}
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}