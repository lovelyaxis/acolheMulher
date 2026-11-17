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
          {/* Imagem */}
          <section className="hidden h-full w-full items-center justify-center bg-cover bg-center bg-no-repeat md:flex">
            <img
              src="src/assets/tela-de-login.png"
              alt="Imagem de login"
              className="h-full w-full object-cover"
            />
          </section>

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
