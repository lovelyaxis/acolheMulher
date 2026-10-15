// src/pages/Cadastro.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/ButtonLuna";
import Input from "../components/InputLuna";

const initialValues = {
  nome: "",
  email: "",
  cargo: "",
  senha: "",
  confirmarSenha: "",
  aceitouTermos: false,
};

function validar(values) {
  const errors = {};

  if (!values.nome.trim()) {
    errors.nome = "Informe seu nome completo.";
  }

  if (!values.email.trim()) {
    errors.email = "Informe seu e-mail.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!values.cargo.trim()) {
    errors.cargo = "Informe seu cargo ou função.";
  }

  if (!values.senha) {
    errors.senha = "Informe uma senha.";
  } else if (values.senha.length < 8) {
    errors.senha = "A senha deve ter pelo menos 8 caracteres.";
  }

  if (!values.confirmarSenha) {
    errors.confirmarSenha = "Confirme sua senha.";
  } else if (values.confirmarSenha !== values.senha) {
    errors.confirmarSenha = "As senhas não coincidem.";
  }

  if (!values.aceitouTermos) {
    errors.aceitouTermos = "É necessário aceitar os termos para continuar.";
  }

  return errors;
}

function IlustracaoCadastro() {
  return (
    <aside
      aria-hidden="true"
      className="relative hidden min-h-[620px] overflow-hidden rounded-3xl bg-brand p-10 text-white shadow-lg lg:flex lg:flex-col lg:justify-between"
    >
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
      <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-[#3AAFA9]/30" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="rounded-2xl bg-white/15 p-3">
          <HeartHandshake size={28} />
        </div>
        <span className="font-poppins text-lg font-semibold">AcolheMulher</span>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center py-10">
        <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-white/25 bg-white/10">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white text-brand shadow-xl">
            <HeartHandshake size={76} strokeWidth={1.5} />
          </div>
          <div className="absolute right-1 top-8 rounded-2xl bg-white p-3 text-[#2E9E5B] shadow-lg">
            <ShieldCheck size={30} />
          </div>
          <div className="absolute bottom-7 left-0 rounded-2xl bg-white p-3 text-[#E8A33D] shadow-lg">
            <Sparkles size={28} />
          </div>
        </div>

        <p className="mt-8 text-center font-poppins text-2xl font-semibold leading-snug">
          Uma rede de apoio começa com você.
        </p>
        <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-white/80">
          Faça parte de uma rede que acolhe, orienta e fortalece mulheres.
        </p>
      </div>

      <p className="relative z-10 text-sm text-white/75">
        Acolhimento e orientação para quem precisa.
      </p>
    </aside>
  );
}

export default function Cadastro() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [sucesso, setSucesso] = useState("");

  function atualizarCampo(campo, valor) {
    const novosValores = { ...values, [campo]: valor };
    setValues(novosValores);
    setSucesso("");

    if (tentouEnviar) {
      setErrors(validar(novosValores));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setTentouEnviar(true);

    const novosErros = validar(values);
    setErrors(novosErros);

    if (Object.keys(novosErros).length === 0) {
      setSucesso("Cadastro realizado com sucesso. Esta confirmação é apenas demonstrativa.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page font-inter text-navy">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid w-full max-w-6xl items-stretch gap-8 lg:grid-cols-2">
          <IlustracaoCadastro />

          <section
            aria-labelledby="cadastro-titulo"
            className="w-full rounded-3xl border border-navy/5 bg-white p-6 shadow-lg sm:p-9"
          >
            <div className="mb-7">
              <h1
                id="cadastro-titulo"
                className="font-poppins text-2xl font-semibold text-navy sm:text-3xl"
              >
                Crie sua conta
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-navy/70">
                Cadastre-se para acessar a plataforma como profissional da rede de atendimento.
              </p>
            </div>

            {sucesso && (
              <p
                role="status"
                className="mb-5 rounded-xl border border-success/20 bg-success-soft px-4 py-3 text-sm text-success"
              >
                {sucesso}
              </p>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <Input
                label="Nome completo"
                placeholder="Digite seu nome completo"
                type="text"
                value={values.nome}
                onChange={(event) => atualizarCampo("nome", event.target.value)}
                error={errors.nome}
              />

              <Input
                label="E-mail"
                placeholder="voce@exemplo.com"
                type="email"
                value={values.email}
                onChange={(event) => atualizarCampo("email", event.target.value)}
                error={errors.email}
              />

              <Input
                label="Cargo/função"
                placeholder="Ex.: Assistente social"
                type="text"
                value={values.cargo}
                onChange={(event) => atualizarCampo("cargo", event.target.value)}
                error={errors.cargo}
              />

              <div className="relative">
                <Input
                  label="Senha"
                  placeholder="Mínimo de 8 caracteres"
                  type={mostrarSenha ? "text" : "password"}
                  value={values.senha}
                  onChange={(event) => atualizarCampo("senha", event.target.value)}
                  error={errors.senha}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((visivel) => !visivel)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={mostrarSenha}
                  className="absolute right-3 top-[34px] rounded-md p-1 text-navy/60 transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirmar senha"
                  placeholder="Digite novamente sua senha"
                  type={mostrarConfirmacao ? "text" : "password"}
                  value={values.confirmarSenha}
                  onChange={(event) =>
                    atualizarCampo("confirmarSenha", event.target.value)
                  }
                  error={errors.confirmarSenha}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmacao((visivel) => !visivel)}
                  aria-label={
                    mostrarConfirmacao
                      ? "Ocultar confirmação da senha"
                      : "Mostrar confirmação da senha"
                  }
                  aria-pressed={mostrarConfirmacao}
                  className="absolute right-3 top-[34px] rounded-md p-1 text-navy/60 transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {mostrarConfirmacao ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              <div className="pt-1">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-navy/80">
                  <input
                    type="checkbox"
                    checked={values.aceitouTermos}
                    onChange={(event) =>
                      atualizarCampo("aceitouTermos", event.target.checked)
                    }
                    aria-invalid={Boolean(errors.aceitouTermos)}
                    aria-describedby={
                      errors.aceitouTermos ? "termos-erro" : undefined
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-[#7B3FA6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  />
                  <span>
                    Li e aceito os termos de uso e a política de privacidade
                  </span>
                </label>
                {errors.aceitouTermos && (
                  <p id="termos-erro" role="alert" className="mt-1 text-sm text-danger">
                    {errors.aceitouTermos}
                  </p>
                )}
              </div>

              <Button variant="primary" type="submit">
                Criar conta
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-navy/70">
              Já tem conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-brand underline-offset-4 transition hover:text-primary-hover hover:underline"
              >
                Entrar
              </Link>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
