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
        className="mt-8 rounded-2xl border border-brand/15 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)_auto] md:items-end">
          <div>
            <label
              htmlFor={idTermo}
              className="block text-sm font-semibold text-navy"
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
              className="mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy transition placeholder:text-navy/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />

            <p
              id={idDicaTermo}
              className="mt-2 text-xs leading-5 text-gray-600"
            >
              O CEP pode ser digitado com ou sem traço.
            </p>
          </div>

          <div>
            <label
              htmlFor={idTipo}
              className="block text-sm font-semibold text-navy"
            >
              Tipo de unidade
            </label>

            <select
              id={idTipo}
              name="tipo"
              value={tipo}
              onChange={aoTrocarTipo}
              className="mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="">Todos os tipos</option>

              {TIPOS_UNIDADE.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
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
      </form>

      <div className="mt-8">
        {carregando && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-2xl border border-brand/15 bg-white px-5 py-4 text-sm font-medium text-navy"
          >
            <LoaderCircle
              className="h-5 w-5 animate-spin text-brand"
              aria-hidden="true"
            />
            Buscando unidades da rede...
          </p>
        )}

        {!carregando && erro && (
          <div
            role="alert"
            className="rounded-2xl border border-danger/30 bg-danger-soft p-5 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <TriangleAlert
                className="mt-0.5 h-5 w-5 shrink-0 text-danger"
                aria-hidden="true"
              />

              <div>
                <h3 className="text-lg font-semibold text-navy">
                  Não foi possível carregar agora
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {erro} Se você precisa de orientação neste momento,
                  ligue{" "}
                  <a
                    href="tel:180"
                    className="rounded font-semibold text-brand underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    180
                  </a>{" "}
                  — a ligação é gratuita e sigilosa.
                </p>

                <button
                  type="button"
                  onClick={tentarNovamente}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-brand bg-white px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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
            className="rounded-2xl border border-brand/15 bg-white p-6 text-center shadow-sm sm:p-8"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
              <SearchX
                className="h-7 w-7 text-brand"
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-navy">
              Nenhuma unidade encontrada por aqui
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-700">
              Não encontramos nenhuma unidade com esse CEP ou bairro.
              Vale conferir se o CEP está completo ou tentar apenas o
              nome do bairro. Se você precisar de orientação agora,
              ligue{" "}
              <a
                href="tel:180"
                className="rounded font-semibold text-brand underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                180
              </a>{" "}
              — o atendimento é gratuito, sigiloso e acolhedor.
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              Em situação de risco imediato, ligue{" "}
              <a
                href="tel:190"
                className="rounded font-semibold text-brand underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                190
              </a>
              .
            </p>
          </div>
        )}

        {!carregando && !erro && total > 0 && (
          <>
            <p role="status" className="text-sm font-medium text-navy">
              {resumoResultados}
            </p>

            <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {unidades.map((unidade) => (
                <li key={unidade.id}>
                  <CardUnidade unidade={unidade} mostrarVagas={mostrarVagas} />
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs leading-5 text-gray-600">
              Horários e telefones podem mudar. Se não conseguir
              contato, ligue 180 para receber orientação sobre a
              unidade mais próxima.
            </p>
          </>
        )}
      </div>
    </>
  );
}
