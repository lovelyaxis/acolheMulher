import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  Heart,
  HeartHandshake,
  House,
  ClipboardList,
  MapPin,
  UserRound,
  LogOut,
  FileText,
  Clock3,
  CheckCircle2,
  Plus,
  Search,
  Menu,
  X,
  Bell,
  ChevronDown,
  ArrowUpRight,
  Users,
  CalendarDays,
  CircleCheck,
  AlertCircle,
  Send,
  ShieldCheck,
} from "lucide-react";

const encaminhamentosIniciais = [
  {
    codigo: "AM-024",
    servico: "Assistência social",
    destino: "Casa da Mulher Brasileira",
    data: "12/09/2026",
    status: "Concluído",
  },
  {
    codigo: "AM-023",
    servico: "Orientação jurídica",
    destino: "Defensoria Pública",
    data: "12/09/2026",
    status: "Pendente",
  },
  {
    codigo: "AM-022",
    servico: "Apoio psicológico",
    destino: "CRAS Centro",
    data: "11/09/2026",
    status: "Concluído",
  },
  {
    codigo: "AM-021",
    servico: "Assistência social",
    destino: "Delegacia da Mulher (DEAM)",
    data: "11/09/2026",
    status: "Pendente",
  },
  {
    codigo: "AM-020",
    servico: "Orientação jurídica",
    destino: "Defensoria Pública",
    data: "10/09/2026",
    status: "Pendente",
  },
];

const servicosDisponiveis = [
  "Assistência social",
  "Apoio psicológico",
  "Orientação jurídica",
  "Atendimento de saúde",
  "Acolhimento especializado",
];

const unidadesDisponiveis = [
  "Casa da Mulher Brasileira",
  "Centro de referência",
  "CRAS Centro",
  "Defensoria Pública",
  "Delegacia da Mulher (DEAM)",
  "Hospital de Referência",
  "Unidade de atendimento",
];


function BadgeStatus({ status }) {
  const estilos = {
    Concluído: "bg-emerald-50 text-emerald-700",
    Pendente: "bg-amber-50 text-amber-700",
    Cancelado: "bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        estilos[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status === "Concluído" && <CheckCircle2 size={13} />}
      {status === "Pendente" && <Clock3 size={13} />}
      {status === "Cancelado" && <AlertCircle size={13} />}
      {status}
    </span>
  );
}


function CartaoMetrica({ titulo, valor, icone, cor }) {
  return (
    <article className="flex min-w-0 items-center gap-3 rounded-xl border border-[#EAE3F4] bg-white p-4 shadow-[0_3px_14px_rgba(36,29,69,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:gap-4 sm:p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${cor}`}
      >
        {icone}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
        <p className="text-3xl font-extrabold text-slate-900">
          {valor}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {titulo}
        </p>
      </div>
    </article>
  );
}

export default function DashboardProfissional() {
  const [encaminhamentos, setEncaminhamentos] = useState(() => {
  const salvos = sessionStorage.getItem("acolheMulherEncaminhamentos");

  return salvos
    ? [...JSON.parse(salvos), ...encaminhamentosIniciais]
        .filter(
          (item, indice, lista) =>
            lista.findIndex(
              (outro) => outro.codigo === item.codigo
            ) === indice
        )
    : encaminhamentosIniciais;
});
  const [menuAberto, setMenuAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("sucesso");
  const [formulario, setFormulario] = useState({
    servico: "",
    destino: "",
    observacoes: "",
  });
  const [erros, setErros] = useState({});
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleSair() {
    logout();
    navigate("/login");
  }

  const pendentes = encaminhamentos.filter(
    (item) => item.status === "Pendente"
  ).length;

  const concluidos = encaminhamentos.filter(
    (item) => item.status === "Concluído"
  ).length;

  const encaminhamentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return encaminhamentos.filter((item) => {
      const correspondeFiltro =
        filtro === "Todos" || item.status === filtro;

      const correspondeBusca = [
        item.codigo,
        item.servico,
        item.destino,
        item.data,
      ].some((campo) =>
        campo.toLocaleLowerCase("pt-BR").includes(termo)
      );

      return correspondeFiltro && correspondeBusca;
    });
  }, [encaminhamentos, busca, filtro]);

  function mostrarMensagem(texto, tipo = "sucesso") {
    setMensagem(texto);
    setTipoMensagem(tipo);
  }

  function abrirModal() {
    setFormulario({
      servico: "",
      destino: "",
      observacoes: "",
    });
    setErros({});
    setModalAberto(true);
    setMenuAberto(false);
    setMensagem("");
  }

  function fecharModal() {
    setModalAberto(false);
    setErros({});
  }

  function alterarCampo(campo, valor) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setErros((anteriores) => ({
      ...anteriores,
      [campo]: "",
    }));
  }

  function registrarEncaminhamento(evento) {
    evento.preventDefault();

    const novosErros = {};

    if (!formulario.servico) {
      novosErros.servico = "Selecione o tipo de atendimento.";
    }

    if (!formulario.destino) {
      novosErros.destino = "Selecione a unidade de destino.";
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    const maiorCodigo = encaminhamentos.reduce((maior, item) => {
      const numero = Number(item.codigo.replace("AM-", ""));
      return Math.max(maior, numero);
    }, 0);

    const novoEncaminhamento = {
      codigo: `AM-${String(maiorCodigo + 1).padStart(3, "0")}`,
      servico: formulario.servico,
      destino: formulario.destino,
      data: new Date().toLocaleDateString("pt-BR"),
      status: "Pendente",
      observacoes: formulario.observacoes.trim(),
    };

    setEncaminhamentos((anteriores) => [
      novoEncaminhamento,
      ...anteriores,
    ]);

    setBusca("");
    setFiltro("Todos");
    fecharModal();
    mostrarMensagem(
      `Encaminhamento ${novoEncaminhamento.codigo} registrado nesta demonstração.`
    );
  }

  function limparFiltros() {
    setBusca("");
    setFiltro("Todos");
  }

  function abrirPerfil() {
    setPerfilAberto(true);
    setMenuAberto(false);
  }

  return (
    <div className="min-h-screen bg-purple-50/50 font-inter text-[#241D45] md:flex">
      {/* Fundo escuro para o menu em telas pequenas */}
      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-[#18132F]/50 md:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* MENU LATERAL */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-white transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          menuAberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <Heart
              size={21}
              fill="#C9A0F0"
              className="text-[#C9A0F0]"
            />
            <span className="font-poppins text-sm font-bold tracking-tight">
              AcolheMulher
            </span>
          </div>

          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          aria-label="Menu principal"
          className="flex-1 space-y-1.5 px-3 py-5"
        >
          <a
            href="#inicio"
            onClick={() => setMenuAberto(false)}
            className="flex items-center gap-3 rounded-lg bg-purple-600 px-3 py-3 text-sm font-medium text-white transition hover:bg-[#8C4DB7]"
          >
            <House size={17} />
            Início
          </a>

          <Link
  to="/registrar-encaminhamento"
  onClick={() => setMenuAberto(false)}
  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
>
  <ClipboardList size={17} />
  Registrar encaminhamento
</Link>

          <a
            href="/rede-de-atendimento"
            onClick={() => setMenuAberto(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <MapPin size={17} />
            Consultar rede
            <ArrowUpRight className="ml-auto" size={15} />
          </a>

          <Link
  to="/meu-perfil"
  onClick={() => setMenuAberto(false)}
  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
>
  <UserRound size={17} />
  Meu perfil
</Link>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="mb-3 rounded-lg bg-white/[0.06] p-3">
            <div className="flex items-center gap-2 text-[#D6B6F2]">
              <HeartHandshake size={18} />
              <span className="text-xs font-semibold">
                Acolhimento e respeito
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/65">
              Cada atendimento merece cuidado, respeito e
              confidencialidade.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSair}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} />
            Sair
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main id="inicio" className="min-w-0 flex-1">
        {/* CABEÇALHO */}
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-3 border-b border-purple-100 bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menu"
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto(true)}
              className="rounded-lg p-2 transition hover:bg-[#F5F0FC] md:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <h1  className="text-2xl font-bold text-slate-900">
                Olá, Ana Paula
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Painel do Profissional da Rede
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                type="button"
                aria-label="Ver notificações"
                aria-expanded={notificacoesAbertas}
                onClick={() =>
                  setNotificacoesAbertas((aberto) => !aberto)
                }
                className="relative rounded-full p-2.5 transition hover:bg-[#F5F0FC]"
              >
                <Bell size={19} />
                {pendentes > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-white bg-[#DC3B57]" />
                )}
              </button>

              {notificacoesAbertas && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[min(300px,calc(100vw-32px))] rounded-xl border border-[#EAE3F4] bg-white p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="font-poppins text-sm font-bold">
                      Notificações
                    </h2>
                    <button
                      type="button"
                      aria-label="Fechar notificações"
                      onClick={() => setNotificacoesAbertas(false)}
                      className="rounded-md p-1 hover:bg-[#F5F0FC]"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {pendentes > 0 ? (
                    <div className="mt-3 flex gap-3 rounded-lg bg-[#FFF7E8] p-3">
                      <Clock3
                        size={19}
                        className="mt-0.5 shrink-0 text-[#98600A]"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          Encaminhamentos pendentes
                        </p>
                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          Você tem {pendentes} registro(s) aguardando
                          acompanhamento nesta demonstração.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setFiltro("Pendente");
                            setNotificacoesAbertas(false);
                            document
                              .getElementById("encaminhamentos")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="mt-2 text-xs font-semibold text-[#7B3FA6] hover:underline"
                        >
                          Consultar registros
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-gray-500">
                      Não há encaminhamentos pendentes.
                    </p>
                  )}

                  <p className="mt-3 text-[11px] leading-4 text-gray-400">
                    Avisos gerados a partir dos dados fictícios desta página.
                  </p>
                </div>
              )}
            </div>

            <Link
              type="button"
              onClick={abrirPerfil}
              className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-[#F5F0FC] sm:gap-3 sm:px-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0E5FA] text-xs font-bold text-[#7B3FA6]">
                AP
              </span>
              <span className="hidden sm:block">
                <span className="block text-xs font-semibold">
                  Ana Paula
                </span>
                <span className="mt-1 block text-[10px] text-[#827A99]">
                  Assistente Social · CRAS Centro
                </span>
              </span>
              <ChevronDown
                size={14}
                className="hidden text-[#827A99] sm:block"
              />
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* BOAS-VINDAS E AÇÃO PRINCIPAL */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7B3FA6]">
                Visão geral
              </p>
              <h2 className="mt-1 font-poppins text-xl font-bold sm:text-2xl">
                Acompanhe seus atendimentos
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-[#716A88]">
                Consulte os registros e acompanhe os encaminhamentos da rede.
              </p>
            </div>

            <Link
  to="/registrar-encaminhamento"
  className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-[#7B3FA6] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#63308A] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#7B3FA6]/20 active:translate-y-0 sm:self-center"
>
  <Plus size={17} />
  Novo encaminhamento
</Link>
          </section>

          {/* INDICADORES */}
          <section
            aria-label="Indicadores do painel"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            <CartaoMetrica
              titulo="Atendimentos registrados"
              valor={String(encaminhamentos.length).padStart(2, "0")}
              icone={<FileText size={20} />}
              cor="bg-[#F0E5FA] text-[#7B3FA6]"
            />

            <CartaoMetrica
              titulo="Encaminhamentos pendentes"
              valor={String(pendentes).padStart(2, "0")}
              icone={<Clock3 size={20} />}
              cor="bg-[#FFF1D9] text-[#B87512]"
            />

            <CartaoMetrica
              titulo="Encaminhamentos concluídos"
              valor={String(concluidos).padStart(2, "0")}
              icone={<CircleCheck size={20} />}
              cor="bg-[#E3F5EA] text-[#2E9E5B]"
            />
          </section>

          {/* TABELA E FILTROS */}
          <section
            id="encaminhamentos"
            className="scroll-mt-24 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-poppins text-base font-bold">
                  Últimos atendimentos
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#827A99]">
                  {encaminhamentosFiltrados.length} registro(s) encontrado(s)
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block">
                  <span className="sr-only">
                    Buscar encaminhamentos
                  </span>
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#948CA8]"
                  />
                  <input
                    type="search"
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                    placeholder="Buscar código ou serviço"
                    className="min-h-10 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 sm:w-56"
                  />
                </label>

                <label className="relative block">
                  <span className="sr-only">Filtrar por situação</span>
                  <select
                    value={filtro}
                    onChange={(evento) => setFiltro(evento.target.value)}
                    className="min-h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 sm:w-40"
                  >
                    <option value="Todos">Todas as situações</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#827A99]"
                  />
                </label>

                {(busca || filtro !== "Todos") && (
                  <button
                    type="button"
                    onClick={limparFiltros}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* TABELA PARA COMPUTADOR */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Data
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Unidade
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Serviço
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Código
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {encaminhamentosFiltrados.map((item) => (
                    <tr
                      key={item.codigo}
                      className="transition-colors hover:bg-purple-50/30"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                        {item.data}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-800">
                        {item.destino}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {item.servico}
                      </td>
                      <td className="px-6 py-4">
                        <BadgeStatus status={item.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-xs font-semibold text-purple-700">
                        {item.codigo}
                      </td>
                    </tr>
                  ))}

                  {encaminhamentosFiltrados.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center"
                      >
                        <Search
                          size={24}
                          className="mx-auto text-[#A19AAF]"
                        />
                        <p className="mt-3 text-sm font-semibold">
                          Nenhum registro encontrado
                        </p>
                        <p className="mt-1 text-xs text-[#827A99]">
                          Tente outro termo ou limpe os filtros.
                        </p>
                        <button
                          type="button"
                          onClick={limparFiltros}
                          className="mt-3 text-sm font-semibold text-[#7B3FA6] hover:underline"
                        >
                          Limpar filtros
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* CARTÕES PARA CELULAR */}
            <div className="space-y-3 p-4 md:hidden">
              {encaminhamentosFiltrados.map((item) => (
                <article
                  key={item.codigo}
                  className="rounded-xl border border-[#EAE3F4] p-4 transition hover:bg-[#FAF8FD]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#7B3FA6]">
                      {item.codigo}
                    </span>
                    <BadgeStatus status={item.status} />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold">
                    {item.servico}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#716A88]">
                    {item.destino}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-[#827A99]">
                    <CalendarDays size={14} />
                    {item.data}
                  </p>
                </article>
              ))}

              {encaminhamentosFiltrados.length === 0 && (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm font-semibold">
                    Nenhum registro encontrado
                  </p>
                  <button
                    type="button"
                    onClick={limparFiltros}
                    className="mt-2 text-sm font-semibold text-[#7B3FA6] hover:underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-[#EAE3F4] bg-[#FEFDFF] px-4 py-3 sm:px-6">
              <p className="flex items-start gap-2 text-[11px] leading-5 text-[#827A99]">
                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0 text-[#7B3FA6]"
                />
                Demonstração acadêmica: todos os registros são fictícios.
                Os novos encaminhamentos existem apenas enquanto esta página
                permanecer aberta e não são enviados a um banco de dados.
              </p>
            </div>
          </section>

          <footer className="pb-2 text-center text-xs text-[#827A99]">
            AcolheMulher · Informação, acolhimento e proteção.
          </footer>
        </div>
      </main>

      {/* MODAL: NOVO ENCAMINHAMENTO */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#18132F]/55 p-4 backdrop-blur-[2px]"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) fecharModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-encaminhamento"
            className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-[#EAE3F4] p-5 sm:p-6">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E5FA] text-[#7B3FA6]">
                  <ClipboardList size={21} />
                </div>
                <h2
                  id="titulo-modal-encaminhamento"
                  className="mt-3 font-poppins text-lg font-bold"
                >
                  Novo encaminhamento
                </h2>
                <p className="mt-1 text-sm leading-5 text-[#827A99]">
                  Preencha os dados demonstrativos do encaminhamento.
                </p>
              </div>

              <button
                type="button"
                aria-label="Fechar formulário"
                onClick={fecharModal}
                className="rounded-lg p-2 text-[#827A99] transition hover:bg-[#F5F0FC] hover:text-[#241D45]"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={registrarEncaminhamento}
              noValidate
              className="space-y-5 p-5 sm:p-6"
            >
              <div>
                <label
                  htmlFor="servico"
                  className="mb-2 block text-sm font-semibold"
                >
                  Tipo de atendimento <span className="text-[#DC3B57]">*</span>
                </label>
                <select
                  id="servico"
                  value={formulario.servico}
                  onChange={(evento) =>
                    alterarCampo("servico", evento.target.value)
                  }
                  aria-invalid={Boolean(erros.servico)}
                  aria-describedby={
                    erros.servico ? "erro-servico" : undefined
                  }
                  className={`w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#7B3FA6]/15 ${
                    erros.servico
                      ? "border-[#DC3B57]"
                      : "border-[#E5DFEF] focus:border-[#7B3FA6]"
                  }`}
                >
                  <option value="">Selecione um serviço</option>
                  {servicosDisponiveis.map((servico) => (
                    <option key={servico} value={servico}>
                      {servico}
                    </option>
                  ))}
                </select>
                {erros.servico && (
                  <p
                    id="erro-servico"
                    role="alert"
                    className="mt-1.5 text-xs text-[#DC3B57]"
                  >
                    {erros.servico}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="destino"
                  className="mb-2 block text-sm font-semibold"
                >
                  Unidade de destino <span className="text-[#DC3B57]">*</span>
                </label>
                <select
                  id="destino"
                  value={formulario.destino}
                  onChange={(evento) =>
                    alterarCampo("destino", evento.target.value)
                  }
                  aria-invalid={Boolean(erros.destino)}
                  aria-describedby={
                    erros.destino ? "erro-destino" : undefined
                  }
                  className={`w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#7B3FA6]/15 ${
                    erros.destino
                      ? "border-[#DC3B57]"
                      : "border-[#E5DFEF] focus:border-[#7B3FA6]"
                  }`}
                >
                  <option value="">Selecione uma unidade</option>
                  {unidadesDisponiveis.map((unidade) => (
                    <option key={unidade} value={unidade}>
                      {unidade}
                    </option>
                  ))}
                </select>
                {erros.destino && (
                  <p
                    id="erro-destino"
                    role="alert"
                    className="mt-1.5 text-xs text-[#DC3B57]"
                  >
                    {erros.destino}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="observacoes"
                  className="mb-2 block text-sm font-semibold"
                >
                  Observações <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <textarea
                  id="observacoes"
                  rows={3}
                  maxLength={300}
                  value={formulario.observacoes}
                  onChange={(evento) =>
                    alterarCampo("observacoes", evento.target.value)
                  }
                  placeholder="Informações gerais, sem dados pessoais identificáveis"
                  className="w-full resize-y rounded-xl border border-[#E5DFEF] px-3 py-3 text-sm outline-none transition placeholder:text-[#A19AAF] focus:border-[#7B3FA6] focus:ring-2 focus:ring-[#7B3FA6]/15"
                />
                <p className="mt-1 text-right text-xs text-[#948CA8]">
                  {formulario.observacoes.length}/300
                </p>
              </div>

              <div className="rounded-xl bg-[#F5F0FC] p-3">
                <p className="flex items-start gap-2 text-xs leading-5 text-[#625879]">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-[#7B3FA6]"
                  />
                  Não informe nomes, CPF, endereços ou outros dados que
                  identifiquem a pessoa atendida. Este formulário é apenas
                  demonstrativo.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="min-h-11 rounded-full border border-[#E5DFEF] px-5 py-3 text-sm font-semibold text-[#625879] transition hover:bg-[#F5F0FC]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#7B3FA6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#63308A] focus:outline-none focus:ring-4 focus:ring-[#7B3FA6]/20"
                >
                  <Send size={16} />
                  Registrar encaminhamento
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* MODAL: PERFIL DEMONSTRATIVO */}
      {perfilAberto && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#18132F]/55 p-4 backdrop-blur-[2px]"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              setPerfilAberto(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-perfil"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0E5FA] font-bold text-[#7B3FA6]">
                AP
              </div>
              <button
                type="button"
                aria-label="Fechar perfil"
                onClick={() => setPerfilAberto(false)}
                className="rounded-lg p-2 text-[#827A99] transition hover:bg-[#F5F0FC]"
              >
                <X size={20} />
              </button>
            </div>

            <h2
              id="titulo-modal-perfil"
              className="mt-4 font-poppins text-lg font-bold"
            >
              Ana Paula
            </h2>
            <p className="mt-1 text-sm text-[#827A99]">
              Assistente Social
            </p>

            <div className="mt-5 space-y-3 rounded-xl bg-[#F8F5FC] p-4">
              <div>
                <p className="text-xs text-[#827A99]">Unidade de referência</p>
                <p className="mt-1 text-sm font-semibold">CRAS Centro</p>
              </div>
              <div>
                <p className="text-xs text-[#827A99]">Perfil de acesso</p>
                <p className="mt-1 text-sm font-semibold">Profissional da rede</p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#827A99]">
              Perfil fictício utilizado para apresentação acadêmica.
              Não representa uma conta autenticada.
            </p>

            <button
              type="button"
              onClick={() => setPerfilAberto(false)}
              className="mt-5 w-full rounded-full bg-[#7B3FA6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#63308A]"
            >
              Fechar perfil
            </button>
          </section>
        </div>
      )}

      {/* MENSAGEM DE CONFIRMAÇÃO */}
      {mensagem && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 right-4 z-[80] flex w-[calc(100%-32px)] max-w-md items-start gap-3 rounded-xl border p-4 shadow-xl sm:bottom-6 sm:right-6 ${
            tipoMensagem === "sucesso"
              ? "border-[#BDE6CC] bg-white"
              : "border-[#F2C5CF] bg-white"
          }`}
        >
          <div
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              tipoMensagem === "sucesso"
                ? "bg-[#E3F5EA] text-[#2E9E5B]"
                : "bg-[#FCE7EC] text-[#DC3B57]"
            }`}
          >
            {tipoMensagem === "sucesso" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">
              {tipoMensagem === "sucesso" ? "Tudo certo!" : "Atenção"}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#716A88]">
              {mensagem}
            </p>
          </div>

          <button
            type="button"
            aria-label="Fechar mensagem"
            onClick={() => setMensagem("")}
            className="rounded-md p-1 text-[#827A99] transition hover:bg-[#F5F0FC]"
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
