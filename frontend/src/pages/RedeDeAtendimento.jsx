
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
} from "lucide-react"
import Footer from "../components/Footer";
import Header from "../components/Header"

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
    <main className="min-h-screen bg-page text-navy">
        <Header/>
      {/* Acesso rápido aos canais de emergência */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-5 py-3 text-sm text-white sm:px-8">
        <p className="font-medium">
          Precisa de ajuda imediata?
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="tel:190"
            className="rounded-md underline underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Ligar para a Polícia Militar pelo 190"
          >
            190 — Emergência
          </a>

          <a
            href="tel:180"
            className="rounded-md underline underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Ligar para a Central de Atendimento à Mulher pelo 180"
          >
            180 — Central da Mulher
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-brand/10 bg-white px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
              Rede de atendimento
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-5xl">
              Você não está sozinha.
              <span className="mt-1 block text-brand">
                Conheça seus direitos.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
              Conheça os serviços de apoio, saiba quais são seus
              direitos e descubra onde buscar orientação. Você merece
              ser ouvida, respeitada e acolhida, sem julgamentos.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Search className="h-4 w-4" />
                Conhecer os serviços
              </a>

              <a
                href="#direitos"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/25 bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <BookOpen className="h-4 w-4" />
                Conhecer meus direitos
              </a>
            </div>
          </div>

          {/* Espaço reservado para a ilustração do projeto */}
          <div
            className="flex aspect-video min-h-52 items-center justify-center overflow-hidden rounded-2xl border border-brand/15 bg-page p-6"
            aria-label="Espaço reservado para a ilustração do AcolheMulher"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <Heart className="h-8 w-8 text-brand" />
              </div>

              <p className="mt-4 text-lg font-semibold text-brand">
                AcolheMulher
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Informação, acolhimento e proteção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section
        id="servicos"
        className="scroll-mt-6 px-5 py-12 sm:px-8 md:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Rede de proteção
          </span>

          <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
            Onde buscar ajuda?
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Existem diferentes serviços preparados para orientar,
            acolher e apoiar mulheres em situação de violência.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicos.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-brand/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
                    <Icon
                      className="h-6 w-6 text-brand"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-navy">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>

          <p className="mt-6 text-xs leading-5 text-gray-500">
            A disponibilidade e os serviços oferecidos podem variar
            conforme a unidade e a região.
          </p>
        </div>
      </section>

      {/* Direitos */}
      <section
        id="direitos"
        className="scroll-mt-6 border-t border-brand/10 bg-white px-5 py-12 sm:px-8 md:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Informação e cidadania
          </span>

          <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
            Você tem direitos!
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Conhecer seus direitos é um passo importante para buscar
            proteção, orientação e apoio.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {direitos.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-brand/15 bg-page/60 p-5 transition hover:border-brand/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                    <Icon
                      className="h-6 w-6 text-brand"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-4 font-semibold text-navy">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 p-5 sm:p-6">
            <h3 className="font-semibold text-navy">
              Precisa de orientação?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              A Central de Atendimento à Mulher oferece orientação
              pelo número 180. Em situações de emergência policial,
              ligue 190.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="tel:180"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Ligar 180
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href="tel:190"
                className="inline-flex items-center gap-2 rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Ligar 190
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Botão de saída rápida */}
     
      <Footer/>
    </main>
    
  );
}
