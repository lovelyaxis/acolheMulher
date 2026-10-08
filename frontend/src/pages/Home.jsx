import Header from "../components/Header";
import Footer from "../components/Footer";

import { Search, MapPin, FileText } from "lucide-react";

const etapas = [
  {
    numero: "01",
    icone: Search,
    titulo: "Escolha o que você precisa",
    texto: "Encontre ajuda ou conheça seus direitos.",
  },
  {
    numero: "02",
    icone: MapPin,
    titulo: "Encontre um serviço",
    texto: "Veja os serviços disponíveis perto de você.",
  },
  {
    numero: "03",
    icone: FileText,
    titulo: "Saiba como buscar ajuda",
    texto: "Confira informações, contatos e próximos passos.",
  },
];

import { Shield, Heart, Scale, House } from "lucide-react";

const acolhimentos = [
  {
    icone: Shield,
    titulo: "Física",
    texto: "Proteção e atendimento em situações de agressão física.",
    cor: "bg-rose-50 text-rose-700",
  },
  {
    icone: Heart,
    titulo: "Psicológica",
    texto: "Apoio emocional e acompanhamento especializado.",
    cor: "bg-purple-50 text-purple-700",
  },
  {
    icone: Scale,
    titulo: "Jurídica",
    texto: "Orientação sobre direitos e medidas legais.",
    cor: "bg-sky-50 text-sky-700",
  },
  {
    icone: House,
    titulo: "Patrimonial",
    texto: "Orientação em situações de controle ou perda de bens.",
    cor: "bg-emerald-50 text-emerald-700",
  },
];

import { UsersRound } from "lucide-react";


const servicos = [
  {
    icone: Scale,
    titulo: "Defensoria Pública",
    texto: "Orientação e assistência jurídica gratuita.",
  },
  {
    icone: Shield,
    titulo: "Delegacia da Mulher",
    texto: "Atendimento especializado e registro de ocorrência.",
  },
  {
    icone: UsersRound,
    titulo: "CRAS / CREAS",
    texto: "Acolhimento e acompanhamento social.",
  },
];


export default function Home() {
    return (
        <>
        <Header/>

            <main className="min-h-screen bg-white text-navy">
      {/* Hero */}
      <section className="bg-page">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-2 md:py-16">
          <div>
            

            <h1 className="mt-4 max-w-lg font-[Poppins] text-4xl font-bold leading-tight md:text-5xl">
              Encontre ajuda perto de você
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-[#514B68] md:text-base">
              Serviços de acolhimento, orientação e apoio para mulheres.
              Você merece ser ouvida e receber ajuda com respeito.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#buscar"
                className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#63308A]"
              >
                Encontrar atendimento
              </a>
              <a
                href="#acolhimentos"
                className="rounded-full border border-brand px-5 py-3 text-sm font-semibold text-brand transition hover:bg-white"
              >
                Conhecer meus direitos
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="/images/hero-acolhemulher.png"
              alt="Ilustração de uma mulher se acolhendo"
              className="max-h-72 w-full max-w-md object-contain"
            />
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            É simples e seguro
          </span>
          <h2 className="mt-1 font-[Poppins] text-2xl font-bold">
            Como funciona
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Em poucos passos, encontre informações e serviços de apoio.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
{etapas.map((etapa) => {
  const Icone = etapa.icone;

  return (
    <article
      key={etapa.numero}
      className="rounded-2xl border border-purple-100 bg-[#FCFAFE] p-5"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-xl text-brand">
          <Icone size={20} aria-hidden="true" />
        </span>
        <span className="text-xs font-bold text-purple-300">
          {etapa.numero}
        </span>
      </div>
      <h3 className="mt-4 font-semibold">{etapa.titulo}</h3>
      <p className="mt-2 text-sm leading-5 text-gray-600">
        {etapa.texto}
      </p>
    </article>
  );
})}
        </div>
      </section>

      {/* Tipos de acolhimento */}
      <section id="acolhimentos" className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Você não está sozinha
          </span>
          <h2 className="mt-1 font-[Poppins] text-2xl font-bold">
            Tipos de acolhimento
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Cada situação é única. Há diferentes formas de receber apoio.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {acolhimentos.map((item) => {
    const Icone = item.icone;

    return (
      <article
        key={item.titulo}
        className={`rounded-2xl p-5 ${item.cor}`}
      >
        <span className="text-2xl" aria-hidden="true">
          <Icone />
        </span>
        <h3 className="mt-3 font-semibold">{item.titulo}</h3>
        <p className="mt-2 text-sm leading-5 text-gray-600">
          {item.texto}
        </p>
      </article>
    );
  })}
</div>
      </section>

      {/* Busca de atendimento */}
      <section id="buscar" className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Rede de atendimento
            </span>
            <h2 className="mt-1 font-[Poppins] text-2xl font-bold">
              Encontre atendimento perto de você
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Busque serviços de apoio e encontre opções para receber
              orientação na sua região.
            </p>

            <form
              className="mt-5 flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="localizacao" className="sr-only">
                Cidade ou CEP
              </label>
              <input
                id="localizacao"
                type="text"
                placeholder="Digite sua cidade ou CEP"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-purple-100"
              />
              <button
                type="submit"
                className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-[#63308A]"
              >
                Buscar atendimento
              </button>
            </form>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {servicos.map((servico) => {
  const Icone = servico.icone;

  return (
    <article key={servico.titulo} className="rounded-2xl border border-purple-100 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-brand">
          <Icone size={20} aria-hidden="true" />
        </span>

        <div>
          <h3 className="font-semibold">{servico.titulo}</h3>
          <p className="mt-1 text-sm leading-5 text-gray-600">
            {servico.texto}
          </p>
        </div>
      </div>
    </article>
  );
})}
          </div>
        </div>
      </section>

      {/* Canais de ajuda */}
      <section className="bg-[#FCE7EC]">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-7 md:grid-cols-3">
          <div className="md:col-span-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC3B57]">
              Precisa de ajuda agora?
            </span>
          </div>

          <article>
            <h3 className="font-[Poppins] text-lg font-bold text-[#DC3B57]">
              Ligue 180
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              Central de Atendimento à Mulher.
            </p>
            <a
              href="tel:180"
              className="mt-3 inline-block rounded-full bg-[#DC3B57] px-4 py-2 text-sm font-semibold text-white"
            >
              Ligar 180
            </a>
          </article>

          <article>
            <h3 className="font-[Poppins] text-lg font-bold text-[#DC3B57]">
              Emergência
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              Em situação de perigo imediato, ligue para a Polícia Militar.
            </p>
            <a
              href="tel:190"
              className="mt-3 inline-block rounded-full bg-[#DC3B57] px-4 py-2 text-sm font-semibold text-white"
            >
              Ligar 190
            </a>
          </article>

          <p className="self-center text-sm leading-5 text-gray-700">
            Se não puder ligar com segurança, tente buscar ajuda de alguém de
            confiança ou de um serviço próximo.
          </p>
        </div>
      </section>
    </main>

        <Footer/>
        </>
    );
}