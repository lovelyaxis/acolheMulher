import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../auth/AuthContext";
import { AlertCircle, Eye, EyeOff, LockKeyhole, Mail, ShieldAlert } from "lucide-react";

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

      <main className="flex flex-1 items-center bg-white py-0 md:bg-soft md:py-10">
        <div className="mx-auto grid w-full max-w-6xl overflow-hidden bg-white shadow-lg md:min-h-[640px] md:grid-cols-2 md:rounded-3xl">
          {/* Ilustração */}
          <div
            className="hidden flex-col items-center justify-center bg-soft p-8 md:flex lg:p-12"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 500 440"
              className="w-full max-w-lg"
              role="img"
            >
              <title>Ilustração de uma pessoa usando o celular</title>

              <circle cx="250" cy="220" r="185" fill="#F0E7FA" />
              <circle cx="105" cy="117" r="15" fill="#D9C3EC" />
              <circle cx="390" cy="300" r="11" fill="#BFE7E4" />
              <path
                d="M66 350c39-42 89-63 151-63 75 0 132 22 188 70v30H66v-37Z"
                fill="#E3D4F0"
              />

              {/* Cabelo */}
              <path
                d="M164 137c0-61 35-96 88-96 57 0 91 41 91 99v88H164v-91Z"
                fill="#342345"
              />

              {/* Pescoço e rosto */}
              <path d="M224 206h56v59h-56z" fill="#D99372" />
              <path
                d="M187 128c0-43 26-69 68-69 44 0 67 29 67 72v48c0 49-29 78-67 78-39 0-68-31-68-78v-51Z"
                fill="#F0B18E"
              />

              {/* Cabelo ao redor do rosto */}
              <path
                d="M185 137c8-12 15-32 16-52 17 15 41 23 73 22 19 0 35-4 48-12-1-35-28-57-70-57-44 0-72 26-72 71v83c8-11 11-32 5-55Z"
                fill="#342345"
              />
              <path
                d="M321 125c12 20 11 49 2 70l-7-27v-38l5-5Z"
                fill="#342345"
              />

              {/* Rosto */}
              <path
                d="M215 151c7-5 15-5 22-1"
                fill="none"
                stroke="#573D45"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M275 150c7-5 15-5 22-1"
                fill="none"
                stroke="#573D45"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="227" cy="163" r="3" fill="#342345" />
              <circle cx="287" cy="163" r="3" fill="#342345" />
              <path
                d="M250 165c-2 10-4 17-2 20 2 2 6 2 9 0"
                fill="none"
                stroke="#CF866F"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M239 198c9 7 20 7 29 0"
                fill="none"
                stroke="#A94F60"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Corpo e roupa */}
              <path
                d="M210 248c-37 8-58 31-70 73l-18 74h245l-24-84c-10-34-29-54-62-63l-25 20-22-20h-24Z"
                fill="#7B3FA6"
              />
              <path
                d="m234 246 22 25 22-25 17 14-26 50h-26l-27-50 18-14Z"
                fill="#FFFFFF"
              />
              <path
                d="M142 319c20-22 42-35 68-40"
                fill="none"
                stroke="#63308A"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Braço */}
              <path
                d="M298 278c25 6 43 19 52 41l21 48c5 12-1 24-12 28-11 4-22-2-27-13l-24-48-29-18 19-38Z"
                fill="#F0B18E"
              />

              {/* Celular */}
              <g transform="rotate(8 352 258)">
                <rect
                  x="326"
                  y="202"
                  width="55"
                  height="104"
                  rx="11"
                  fill="#241D45"
                />
                <rect
                  x="331"
                  y="210"
                  width="45"
                  height="84"
                  rx="6"
                  fill="#FFFFFF"
                />
                <rect
                  x="344"
                  y="204"
                  width="18"
                  height="3"
                  rx="1.5"
                  fill="#B7A7C6"
                />
                <circle cx="353.5" cy="285" r="3" fill="#D8CBE3" />
                <path
                  d="M340 238h27M340 247h20"
                  stroke="#D9C3EC"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="353" cy="263" r="10" fill="#BFE7E4" />
                <path
                  d="m349 263 3 3 6-7"
                  fill="none"
                  stroke="#268E87"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Mão */}
              <path
                d="M344 350c7-8 12-17 15-26 2-6 8-8 12-4 3 3 2 8 0 13l-6 14c8-8 13-15 18-19 4-4 10-2 11 3 1 4-2 8-5 12l-15 20c-8 11-19 14-31 8l-8-4 9-17Z"
                fill="#F0B18E"
              />
            </svg>
            <p className="mt-6 max-w-sm text-center text-base leading-7 text-navy/70">
              Um espaço de acolhimento para quem cuida e protege.
            </p>
          </div>

          {/* Formulário */}
          <section className="flex w-full items-center justify-center px-6 py-10 sm:px-10 md:px-8 lg:px-12">
            <div className="w-full max-w-sm">
            <h1 className="font-poppins text-3xl font-semibold text-navy sm:text-4xl">
              Bem-vindo de volta!
            </h1>

            <p className="mt-3 text-sm leading-6 text-navy/70">
              Acesse sua conta para continuar seu trabalho na rede de acolhimento.
            </p>

            {bloqueadoAte && (
              <div className="mt-6 flex gap-3 rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger" role="alert">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <p>
                  Sua conta está temporariamente bloqueada por várias tentativas
                  incorretas. Tente novamente em{" "}
                  <strong>{minutosBloqueio} minuto(s)</strong>.
                </p>
              </div>
            )}
            {!bloqueadoAte && tentativasRestantes < 5 && tentativasRestantes > 0 && (
              <p className="mt-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-soft p-3 text-sm text-navy" role="status">
                <AlertCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Tentativa{tentativasRestantes === 1 ? "" : "s"} restante(s):
                <strong>{tentativasRestantes}</strong> de 5
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="login"
                  className="mb-2 block text-sm font-semibold text-navy"
                >
                  E-mail
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/50" aria-hidden="true" />
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
                    className="h-12 w-full rounded-xl border border-navy/20 bg-white pl-12 pr-4 text-sm text-navy outline-none transition placeholder:text-navy/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus-visible:ring-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="mb-2 block text-sm font-semibold text-navy"
                >
                  Senha
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/50" aria-hidden="true" />
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
                    className="h-12 w-full rounded-xl border border-navy/20 bg-white pl-12 pr-24 text-sm text-navy outline-none transition placeholder:text-navy/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus-visible:ring-2"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha((visivel) => !visivel)}
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={mostrarSenha}
                    className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-primary transition hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {mostrarSenha ? (
                      <>
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        Mostrar
                      </>
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
                className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  bloqueadoAte || enviando
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-linear-to-r from-primary to-primary-hover hover:to-primary"
                }`}
              >
                {enviando ? "Entrando..." : "Entrar"}
              </button>

              {mensagem && (
                <div
                  className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger-soft p-3.5 text-sm text-danger"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <p>{mensagem}</p>
                </div>
              )}
            </form>
            </div>
          </section>
        </div>
      </main>
    <Footer/>
    </div>
    
  );
}
