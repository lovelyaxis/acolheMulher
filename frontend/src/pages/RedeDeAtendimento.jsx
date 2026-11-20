import {
  Home,
  HeartPulse,
  ShieldAlert,
  Scale,
  Users,
  ShieldCheck,
  Heart,
  GraduationCap,
  UserCheck,
  Search,
  BookOpen,
  ExternalLink,
  PhoneCall,
  MapPin
} from "lucide-react"
import Footer from "../components/Footer";
import Header from "../components/Header"
import redeAtendimentoImage from "../assets/rede-de-atendimento.png";
import BuscaUnidades from "../components/BuscaUnidades";
import { buscarUnidades } from "../services/unidadesService";

export default function RedeDeAtendimento() {
  const servicos = [
    {
      icon: Home,
      title: "Casas de Acolhimento",
      description:
        "Acolhimento temporário e protegido para mulheres que precisam se afastar de situações de risco.",
    },
    {
      icon: HeartPulse,
      title: "Atendimento de Saúde",
      description:
        "Atendimento médico e apoio psicológico, conforme as necessidades de cada mulher.",
    },
    {
      icon: ShieldAlert,
      title: "Delegacias da Mulher",
      description:
        "Atendimento especializado, registro de ocorrências e orientações sobre medidas de proteção.",
    },
    {
      icon: Scale,
      title: "Assistência Jurídica",
      description:
        "Orientação sobre direitos, medidas protetivas e acesso à Justiça.",
    },
    {
      icon: Users,
      title: "Assistência Social",
      description:
        "Apoio social, orientação e encaminhamento para serviços da rede de proteção.",
    },
  ];

  const direitos = [
    {
      icon: ShieldCheck,
      title: "Direito à Proteção",
      description:
        "Acesso às medidas protetivas previstas em lei, conforme cada situação.",
    },
    {
      icon: Heart,
      title: "Direito à Saúde",
      description:
        "Acesso ao atendimento de saúde e ao acolhimento humanizado, sem discriminação.",
    },
    {
      icon: GraduationCap,
      title: "Direito à Educação",
      description:
        "Direito de estudar em um ambiente seguro, com respeito e sem discriminação.",
    },
    {
      icon: UserCheck,
      title: "Direito à Dignidade",
      description:
        "Direito ao respeito, à igualdade e a uma vida livre de violência.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-navy font-sans flex flex-col">
      <Header />

      {/* Acesso rápido aos canais de emergência reformulado */}
      <div className="bg-slate-900 px-5 py-3 text-white sm:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Precisa de ajuda imediata ou orientação em tempo real?</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:190"
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-1.5 rounded-lg transition"
              aria-label="Ligar para a Polícia Militar pelo 190"
            >
              <PhoneCall size={14} />
              190 — Polícia
            </a>

            <a
              href="tel:180"
              className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-1.5 rounded-lg transition"
              aria-label="Ligar para a Central de Atendimento à Mulher pelo 180"
            >
              <PhoneCall size={14} />
              180 — Central da Mulher
            </a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-purple-100 bg-white px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-purple-100 shadow-sm md:relative md:min-h-[420px]">
            <div className="px-5 py-8 sm:px-8 sm:py-10 md:relative md:z-10 md:flex md:min-h-[420px] md:w-1/2 md:flex-col md:justify-center md:px-10 md:py-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700">
                <MapPin size={13} />
                Rede de atendimento
              </span>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
                Você não está sozinha.
                <span className="mt-1.5 block text-purple-700">
                  Conheça seus direitos.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Conheça os serviços de apoio, saiba quais são seus
                direitos e descubra onde buscar orientação. Você merece
                ser ouvida, respeitada e acolhida, sem julgamentos.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#busca"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  <Search className="h-4 w-4" />
                  Buscar atendimento
                </a>

                <a
                  href="#direitos"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  <BookOpen className="h-4 w-4" />
                  Conhecer meus direitos
                </a>
              </div>
            </div>

            <div className="aspect-video max-h-64 w-full md:absolute md:inset-0 md:h-full md:max-h-none md:aspect-auto">
              <img
                src={redeAtendimentoImage}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Busca na rede de atendimento (RF003) */}
      <section
        id="busca"
        aria-labelledby="busca-titulo"
        className="scroll-mt-24 border-b border-purple-100 bg-slate-50 px-5 py-12 sm:px-8 md:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Consulta pública
          </span>

          <h2
            id="busca-titulo"
            className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Encontre ajuda perto de você
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Informe seu CEP ou o nome do bairro para ver as unidades da rede
            de proteção. Você pode consultar sem se identificar e sem
            informar nenhum dado pessoal.
          </p>

          <div className="mt-6">
            <BuscaUnidades buscar={buscarUnidades} idPrefixo="busca" />
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section
        id="servicos"
        className="scroll-mt-6 px-5 py-12 sm:px-8 md:py-16 bg-white"
      >
        <div className="mx-auto max-w-6xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Rede de proteção
          </span>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Onde buscar ajuda?
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Existem diferentes serviços preparados para orientar,
            acolher e apoiar mulheres em situação de violência.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicos.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-purple-100/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:border-purple-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                    <Icon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>

          <p className="mt-8 text-xs leading-5 text-slate-500 bg-purple-50/50 p-4 rounded-2xl border border-purple-100/60">
            ℹ️ A disponibilidade e os serviços oferecidos podem variar conforme a unidade e a região. Em caso de dúvidas, utilize os canais oficiais.
          </p>
        </div>
      </section>

      {/* Direitos */}
      <section
        id="direitos"
        className="scroll-mt-6 border-t border-purple-100 bg-slate-50 px-5 py-12 sm:px-8 md:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Informação e cidadania
          </span>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Você tem direitos!
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Conhecer seus direitos é um passo importante para buscar
            proteção, orientação e apoio.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {direitos.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition hover:border-purple-300"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                    <Icon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900 text-base">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-3xl border border-purple-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Precisa de orientação imediata?
              </h3>

              <p className="mt-1 text-sm leading-relaxed text-slate-600 max-w-xl">
                A Central de Atendimento à Mulher oferece orientação sigilosa pelo número 180. Em situações de emergência policial, ligue 190.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0">
              <a
                href="tel:180"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition shadow-sm"
              >
                <PhoneCall size={16} />
                Ligar 180
              </a>

              <a
                href="tel:190"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                <ShieldAlert size={16} className="text-rose-600" />
                Ligar 190
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}