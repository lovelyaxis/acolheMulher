
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Network,
  Bell,
  Search,
  Clock3,
  CheckCircle2,
  Users,
  Menu,
  X,
  ArrowUpRight,
  HeartHandshake,
  LogOut,
} from "lucide-react";

const encaminhamentosIniciais = [
  {
    codigo: "AM-024",
    servico: "Assistência social",
    destino: "Unidade de atendimento",
    data: "Hoje",
    status: "Pendente",
  },
  {
    codigo: "AM-021",
    servico: "Apoio psicológico",
    destino: "Centro de referência",
    data: "Hoje",
    status: "Concluído",
  },
  {
    codigo: "AM-018",
    servico: "Orientação jurídica",
    destino: "Unidade de atendimento",
    data: "Ontem",
    status: "Pendente",
  },
  {
    codigo: "AM-015",
    servico: "Assistência social",
    destino: "Centro de referência",
    data: "Ontem",
    status: "Concluído",
  },
];

export default function DashboardProfissional() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  const encaminhamentos = encaminhamentosIniciais.filter((item) => {
    const correspondeFiltro =
      filtro === "Todos" || item.status === filtro;

    const termo = busca.toLowerCase();

    const correspondeBusca =
      item.codigo.toLowerCase().includes(termo) ||
      item.servico.toLowerCase().includes(termo) ||
      item.destino.toLowerCase().includes(termo);

    return correspondeFiltro && correspondeBusca;
  });

  const pendentes = encaminhamentosIniciais.filter(
    (item) => item.status === "Pendente"
  ).length;

  const concluidos = encaminhamentosIniciais.filter(
    (item) => item.status === "Concluído"
  ).length;

  return (
    <div className="min-h-screen bg-page text-navy md:flex">
      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-brand/10 bg-white transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          menuAberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
              <HeartHandshake size={25} />
            </div>
            <div>
              <h1 className="font-poppins text-lg font-bold text-navy">
                AcolheMulher
              </h1>
              <p className="text-xs text-gray-500">
                Área profissional
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
            className="rounded-lg p-2 hover:bg-page md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        
<nav className="flex-1 space-y-2 px-4 py-6">
  <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
    Menu principal
  </p>

  <a
    href="#visao-geral"
    onClick={() => setMenuAberto(false)}
    className="flex items-center gap-3 rounded-xl bg-brand px-4 py-3 font-semibold text-white"
  >
    <LayoutDashboard size={20} />
    Visão geral
  </a>

  <a
    href="#encaminhamentos"
    onClick={() => setMenuAberto(false)}
    className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-page hover:text-brand"
  >
    <ClipboardList size={20} />
    Encaminhamentos

    <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
      {pendentes}
    </span>
  </a>

  <a
    href="/rede-de-atendimento"
    onClick={() => setMenuAberto(false)}
    className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-page hover:text-brand"
  >
    <Network size={20} />
    Rede de atendimento
    <ArrowUpRight className="ml-auto" size={16} />
  </a>
</nav>


        <div className="border-t border-brand/10 p-4">
          <div className="rounded-xl bg-page p-4">
            <div className="flex items-center gap-2 text-brand">
              <HeartHandshake size={19} />
              <span className="text-sm font-semibold">
                Acolhimento e respeito
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-gray-600">
              Cada atendimento deve ser conduzido com cuidado,
              respeito e confidencialidade.
            </p>
          </div>

          <a
            href="/login"
            className="mt-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-page hover:text-brand"
          >
            <LogOut size={19} />
            Voltar ao login
          </a>
        </div>
      </aside>

      <main id="visao-geral" className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-brand/10 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMenuAberto(true)}
              className="rounded-lg p-2 hover:bg-page md:hidden"
            >
              <Menu size={23} />
            </button>

            <div>
              <p className="text-xs text-gray-500">
                Área do profissional
              </p>
              <h2 className="font-poppins text-lg font-bold sm:text-xl">
                Dashboard
              </h2>
            </div>
          </div>

          <button
            type="button"
            aria-label="Notificações demonstrativas"
            title="Notificações demonstrativas"
            className="relative rounded-xl border border-brand/10 p-3 transition hover:bg-page"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-brand">
                Painel de acompanhamento
              </p>
              <h2 className="mt-2 font-poppins text-2xl font-bold sm:text-3xl">
                Olá, profissional!
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Acompanhe os atendimentos e os encaminhamentos
                registrados no painel demonstrativo.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-brand/10 bg-white px-4 py-3 text-sm text-gray-600">
              <Clock3 size={18} className="text-brand" />
              Visão geral dos atendimentos
            </div>
          </section>

          <section
            aria-label="Indicadores demonstrativos"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <article className="rounded-2xl border border-brand/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Atendimentos de hoje
                </span>
                <div className="rounded-xl bg-brand/10 p-3 text-brand">
                  <Users size={22} />
                </div>
              </div>
              <p className="mt-5 font-poppins text-3xl font-bold">08</p>
              <p className="mt-2 text-xs text-gray-500">
                Número ilustrativo
              </p>
            </article>

            <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Encaminhamentos pendentes
                </span>
                <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                  <Clock3 size={22} />
                </div>
              </div>
              <p className="mt-5 font-poppins text-3xl font-bold">
                {pendentes.toString().padStart(2, "0")}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Registros fictícios para demonstração
              </p>
            </article>

            <article className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Encaminhamentos concluídos
                </span>
                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                  <CheckCircle2 size={22} />
                </div>
              </div>
              <p className="mt-5 font-poppins text-3xl font-bold">
                {concluidos.toString().padStart(2, "0")}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Registros fictícios para demonstração
              </p>
            </article>
          </section>

          <section
            id="encaminhamentos"
            className="scroll-mt-24 overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-brand/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-poppins text-lg font-bold">
                  Encaminhamentos recentes
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Consulte os registros ilustrativos do painel.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block">
                  <span className="sr-only">
                    Buscar encaminhamentos
                  </span>
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="search"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Buscar código ou serviço"
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 sm:w-56"
                  />
                </label>

                <label>
                  <span className="sr-only">
                    Filtrar por situação
                  </span>
                  <select
                    value={filtro}
                    onChange={(event) => setFiltro(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand sm:w-auto"
                  >
                    <option>Todos</option>
                    <option>Pendente</option>
                    <option>Concluído</option>
                  </select>
                </label>
              </div>
            </div>

            
{/* Versão para celular: cartões */}
<div className="space-y-3 p-4 md:hidden">
  {encaminhamentos.map((item) => (
    <article
      key={item.codigo}
      className="rounded-xl border border-brand/10 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-poppins font-bold text-brand">
          {item.codigo}
        </h4>

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            item.status === "Pendente"
              ? "bg-amber-100 text-amber-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium text-gray-500">
            Serviço
          </p>
          <p className="mt-1 text-navy">{item.servico}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500">
            Destino
          </p>
          <p className="mt-1 text-gray-600">{item.destino}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500">
            Data
          </p>
          <p className="mt-1 text-gray-600">{item.data}</p>
        </div>
      </div>
    </article>
  ))}

  {encaminhamentos.length === 0 && (
    <p className="py-8 text-center text-sm text-gray-500">
      Nenhum encaminhamento encontrado.
    </p>
  )}
</div>

{/* Versão para computador: tabela original */}
<div className="hidden overflow-x-auto md:block">
  <table className="w-full min-w-[650px] text-left text-sm">
    <thead className="bg-page/70 text-xs uppercase tracking-wide text-gray-500">
      <tr>
        <th className="px-6 py-4 font-semibold">Código</th>
        <th className="px-6 py-4 font-semibold">Serviço</th>
        <th className="px-6 py-4 font-semibold">Destino</th>
        <th className="px-6 py-4 font-semibold">Data</th>
        <th className="px-6 py-4 font-semibold">Situação</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {encaminhamentos.map((item) => (
        <tr
          key={item.codigo}
          className="transition hover:bg-page/50"
        >
          <td className="whitespace-nowrap px-6 py-4 font-semibold text-brand">
            {item.codigo}
          </td>

          <td className="px-6 py-4">{item.servico}</td>

          <td className="px-6 py-4 text-gray-600">
            {item.destino}
          </td>

          <td className="whitespace-nowrap px-6 py-4 text-gray-600">
            {item.data}
          </td>

          <td className="px-6 py-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                item.status === "Pendente"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {item.status}
            </span>
          </td>
        </tr>
      ))}

      {encaminhamentos.length === 0 && (
        <tr>
          <td
            colSpan={5}
            className="px-6 py-10 text-center text-gray-500"
          >
            Nenhum encaminhamento encontrado.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


            <div className="border-t border-brand/10 px-6 py-4">
              <p className="text-xs leading-5 text-gray-500">
                Demonstração acadêmica: todos os códigos, dados e
                indicadores desta página são fictícios. Não representam
                atendimentos reais e não são salvos em um banco de dados.
              </p>
            </div>
          </section>

          <footer className="pb-3 text-center text-xs text-gray-500">
            AcolheMulher · Informação, acolhimento e proteção.
          </footer>
        </div>
      </main>
    </div>
  );
}
