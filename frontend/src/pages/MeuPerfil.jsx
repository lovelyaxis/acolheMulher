
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  UserRound,
  BriefcaseBusiness,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export default function MeuPerfil() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-50/50 font-inter text-[#241D45]">
      <header className="border-b border-purple-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <Heart
              size={25}
              fill="#7B3FA6"
              className="text-[#7B3FA6]"
            />
            <span className="font-poppins font-bold">
              AcolheMulher
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard-profissional")}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#7B3FA6] transition hover:bg-purple-50"
          >
            <ArrowLeft size={17} />
            Voltar ao painel
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#7B3FA6]">
          Conta profissional
        </p>

        <h1 className="mt-2 font-poppins text-2xl font-bold text-slate-900 sm:text-3xl">
          Meu perfil
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#716A88]">
          Consulte as informações do perfil profissional
          utilizado nesta demonstração.
        </p>

        <section className="mt-6 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
          <div className="flex flex-col items-center border-b border-[#EAE3F4] bg-white px-5 py-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F0E5FA] text-xl font-bold text-[#7B3FA6]">
              AP
            </div>

            <h2 className="mt-4 font-poppins text-xl font-bold">
              Ana Paula
            </h2>

            <p className="mt-1 text-sm text-[#827A99]">
              Assistente Social
            </p>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-[#7B3FA6]">
              <ShieldCheck size={14} />
              Profissional da rede
            </span>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#F0E5FA] p-3 text-[#7B3FA6]">
                <UserRound size={20} />
              </div>
              <div>
                <p className="text-xs text-[#827A99]">
                  Nome completo
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Ana Paula
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#F0E5FA] p-3 text-[#7B3FA6]">
                <BriefcaseBusiness size={20} />
              </div>
              <div>
                <p className="text-xs text-[#827A99]">
                  Cargo ou função
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Assistente Social
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#F0E5FA] p-3 text-[#7B3FA6]">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-[#827A99]">
                  Unidade de referência
                </p>
                <p className="mt-1 text-sm font-semibold">
                  CRAS Centro
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#F0E5FA] p-3 text-[#7B3FA6]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs text-[#827A99]">
                  Perfil de acesso
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Profissional da rede
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 rounded-xl border border-purple-100 bg-white p-4">
          <p className="text-xs leading-5 text-[#827A99]">
            Este perfil é fictício e utilizado para apresentação
            acadêmica. Não representa uma conta autenticada e
            não permite editar dados pessoais.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard-profissional")}
          className="mt-5 w-full rounded-full bg-[#7B3FA6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#63308A] sm:w-auto"
        >
          Voltar ao Painel do Profissional da Rede
        </button>
      </main>
    </div>
  );
}
