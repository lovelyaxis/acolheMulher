// Busca e resultados da rede de atendimento, compartilhados entre a consulta
// pública (RF003) e a consulta interna (RF012).
// A função de busca vem por prop para que a tela escolha qual visão usar.
import { useCallback, useEffect, useState } from "react";
import {
  LoaderCircle,
  RefreshCw,
  Search,
  SearchX,
  TriangleAlert,
} from "lucide-react";
import CardUnidade from "./CardUnidade";
import { TIPOS_UNIDADE } from "../services/unidadesService";

const MENSAGEM_ERRO_PADRAO =
  "Não conseguimos carregar a rede de atendimento agora. Tente novamente em instantes.";

export default function BuscaUnidades({
  buscar,
  mostrarVagas = false,
  idPrefixo = "busca",
}) {
  const [termo, setTermo] = useState("");
  const [tipo, setTipo] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [termoAplicado, setTermoAplicado] = useState("");
  const [tipoAplicado, setTipoAplicado] = useState("");

  const carregarUnidades = useCallback(
    async ({ termo: termoBusca = "", tipo: tipoBusca = "" } = {}) => {
      setCarregando(true);
      setErro("");

      try {
        const resultado = await buscar({
          termo: termoBusca,
          tipo: tipoBusca,
        });

        setUnidades(resultado);
      } catch {
        setUnidades([]);
        setErro(MENSAGEM_ERRO_PADRAO);
      } finally {
        setTermoAplicado(termoBusca);
        setTipoAplicado(tipoBusca);
        setCarregando(false);
      }
    },
    [buscar],
  );

  // Ao abrir a tela, mostra todas as unidades ativas (RF003, RF012).
  // O estado só é atualizado depois da resposta, evitando renders em cascata.
  useEffect(() => {
    let desmontado = false;

    buscar()
      .then((resultado) => {
        if (desmontado) return;
        setUnidades(resultado);
      })
      .catch(() => {
        if (desmontado) return;
        setUnidades([]);
        setErro(MENSAGEM_ERRO_PADRAO);
      })
      .finally(() => {
        if (desmontado) return;
        setCarregando(false);
      });

    return () => {
      desmontado = true;
    };
  }, [buscar]);

  const aoBuscar = (event) => {
    event.preventDefault();
    carregarUnidades({ termo, tipo });
  };

  const aoTrocarTipo = (event) => {
    const novoTipo = event.target.value;

    setTipo(novoTipo);
    carregarUnidades({ termo, tipo: novoTipo });
  };

  const tentarNovamente = () =>
    carregarUnidades({ termo: termoAplicado, tipo: tipoAplicado });

  const filtrosAtivos = Boolean(termoAplicado || tipoAplicado);
  const total = unidades.length;

  const resumoResultados =
    total === 1
      ? filtrosAtivos
        ? "1 unidade encontrada"
        : "1 unidade na rede de atendimento"
      : filtrosAtivos
        ? `${total} unidades encontradas`
        : `${total} unidades na rede de atendimento`;

  const idTermo = `${idPrefixo}-termo`;
  const idDicaTermo = `${idTermo}-dica`;
  const idTipo = `${idPrefixo}-tipo`;

  return (
    <>
      <form
        onSubmit={aoBuscar}
        className="mt-8 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Grid ajustado com items-start para manter os rótulos e campos perfeitamente organizados */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)_auto] md:items-start">
          <div>
            <label
              htmlFor={idTermo}
              className="block text-sm font-semibold text-slate-900 mb-1.5"
            >
              CEP ou bairro
            </label>

            <input
              id={idTermo}
              name="termo"
              type="text"
              inputMode="search"
              autoComplete="off"
              value={termo}
              onChange={(event) => setTermo(event.target.value)}
              placeholder="Ex.: 00000-001 ou Centro"
              aria-describedby={idDicaTermo}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            />

            <p
              id={idDicaTermo}
              className="mt-1.5 text-xs text-slate-500"
            >
              O CEP pode ser digitado com ou sem traço.
            </p>
          </div>

          <div>
            <label
              htmlFor={idTipo}
              className="block text-sm font-semibold text-slate-900 mb-1.5"
            >
              Tipo de unidade
            </label>

            <select
              id={idTipo}
              name="tipo"
              value={tipo}
              onChange={aoTrocarTipo}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            >
              <option value="">Todos os tipos</option>

              {TIPOS_UNIDADE.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="md:pt-7">
            <button
              type="submit"
              disabled={carregando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              {carregando ? (
                <LoaderCircle
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Search className="h-4 w-4" aria-hidden="true" />
              )}

              {carregando ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8">
        {carregando && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-2xl border border-purple-100 bg-white px-5 py-4 text-sm font-medium text-slate-800 shadow-sm"
          >
            <LoaderCircle
              className="h-5 w-5 animate-spin text-purple-600"
              aria-hidden="true"
            />
            Buscando unidades da rede...
          </p>
        )}

        {!carregando && erro && (
          <div
            role="alert"
            className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <TriangleAlert
                className="mt-0.5 h-5 w-5 shrink-0 text-rose-600"
                aria-hidden="true"
              />

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Não foi possível carregar agora
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {erro} Se você precisa de orientação neste momento,
                  ligue{" "}
                  <a
                    href="tel:180"
                    className="rounded font-semibold text-purple-700 underline underline-offset-4 hover:text-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                  >
                    180
                  </a>{" "}
                  — a ligação é gratuita e sigilosa.
                </p>

                <button
                  type="button"
                  onClick={tentarNovamente}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-5 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 shadow-sm"
                >
                  <RefreshCw
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {!carregando && !erro && total === 0 && (
          <div
            role="status"
            className="rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-sm"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <SearchX
                className="h-7 w-7"
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Nenhuma unidade encontrada por aqui
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              Não encontramos nenhuma unidade com esse CEP ou bairro.
              Vale conferir se o CEP está completo ou tentar apenas o
              nome do bairro. Se você precisar de orientação agora,
              ligue{" "}
              <a
                href="tel:180"
                className="rounded font-semibold text-purple-700 underline underline-offset-4 hover:text-purple-800"
              >
                180
              </a>{" "}
              — o atendimento é gratuito, sigiloso e acolhedor.
            </p>

            <p className="mt-3 text-sm text-slate-600">
              Em situação de risco imediato, ligue{" "}
              <a
                href="tel:190"
                className="rounded font-semibold text-rose-600 underline underline-offset-4 hover:text-rose-700"
              >
                190
              </a>
              .
            </p>
          </div>
        )}

        {!carregando && !erro && total > 0 && (
          <>
            <p role="status" className="text-sm font-semibold text-slate-700 mb-5">
              {resumoResultados}
            </p>

            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {unidades.map((unidade) => (
                <li key={unidade.id}>
                  <CardUnidade unidade={unidade} mostrarVagas={mostrarVagas} />
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs leading-relaxed text-slate-500 bg-purple-50/50 p-4 rounded-2xl border border-purple-100/60">
              ℹ️ Horários e telefones podem mudar. Se não conseguir contato, ligue 180 para receber orientação sobre a unidade mais próxima.
            </p>
          </>
        )}
      </div>
    </>
  );
}