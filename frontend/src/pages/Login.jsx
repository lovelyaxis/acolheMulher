import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [mensagem, setMensagem] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMensagem("O formulário ainda precisa ser conectado ao sistema de login.");
  }

  return (
    <div className="flex min-h-screen flex-col font-inter">
      <Header />

      <main className="flex flex-1 items-center bg-linear-to-b from-soft to-white py-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 md:grid-cols-2 md:gap-12">
          {/* Ilustração */}
          <div
            className="hidden justify-center md:flex"
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
          </div>

          {/* Formulário */}
          <section className="w-full max-w-md justify-self-center rounded-2xl bg-white p-6 shadow-lg sm:p-8 md:justify-self-end">
            <h1 className="font-poppins text-2xl font-bold text-navy">
              Bem-vinda de volta!
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Faça login para acessar sua conta e continuar seu atendimento.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="login"
                  className="mb-1.5 block text-xs font-semibold text-navy"
                >
                  E-mail ou CPF
                </label>

                <input
                  id="login"
                  name="login"
                  type="text"
                  autoComplete="username"
                  value={login}
                  onChange={(event) => {
                    setLogin(event.target.value);
                    setMensagem("");
                  }}
                  placeholder="Digite seu e-mail ou CPF"
                  required
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

                <Link
                  to="/recuperar-senha"
                  className="font-semibold text-primary hover:text-primary-hover"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Entrar
              </button>

              {mensagem && (
                <p className="text-center text-sm text-gray-600" role="status">
                  {mensagem}
                </p>
              )}
            </form>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">ou</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={() =>
                setMensagem("O acesso pelo Gov.br ainda não foi integrado.")
              }
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 py-3 text-sm font-semibold text-navy transition hover:bg-gray-50"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1351B4] text-[8px] font-bold text-white"
                aria-hidden="true"
              >
                gb
              </span>
              Entrar com Gov.br
            </button>

            <p className="mt-5 text-center text-xs text-gray-500">
              Não tem uma conta?{" "}
              <Link
                to="/cadastro"
                className="font-semibold text-primary hover:text-primary-hover"
              >
                Cadastre-se
              </Link>
            </p>
          </section>
        </div>
      </main>
    <Footer/>
    </div>
  );
}
