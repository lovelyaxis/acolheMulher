// frontend/src/pages/RegistroOcorrencias.jsx
import { useEffect, useState } from "react";
import {
  listarOcorrencias,
  registrarOcorrencia,
} from "../services/ocorrenciasService";

const TIPOS_EVENTO = [
  "Acolhimento de Urgência",
  "Solicitação de Medida Protetiva",
  "Orientação Telefônica",
];

export default function RegistroOcorrencias() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("sucesso");
  const [enviando, setEnviando] = useState(false);
  const [formulario, setFormulario] = useState({
    tipoEvento: "",
    observacoes: "",
  });

  async function carregarOcorrencias() {
    setCarregando(true);
    setErro("");
    try {
      const lista = await listarOcorrencias();
      setOcorrencias(lista);
    } catch (e) {
      setOcorrencias([]);
      setErro(
        e.message || "Não foi possível carregar as ocorrências.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarOcorrencias();
  }, []);

  function alterarCampo(campo, valor) {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setErro("");
  }

  function mostrarMensagem(texto, tipo = "sucesso") {
    setMensagem(texto);
    setTipoMensagem(tipo);
  }

  async function handleRegistrar(evento) {
    evento.preventDefault();

    if (!formulario.tipoEvento) {
      setErro("Selecione o tipo de evento.");
      return;
    }

    setEnviando(true);
    setErro("");

    try {
      const nova = await registrarOcorrencia({
        tipoEvento: formulario.tipoEvento,
        observacoes: formulario.observacoes.trim(),
      });

      setOcorrencias((atuais) => [nova, ...atuais]);
      setFormulario({ tipoEvento: "", observacoes: "" });
      mostrarMensagem("Ocorrência registrada com sucesso.", "sucesso");
    } catch (e) {
      if (e.status === 401) {
        mostrarMensagem(
          "Sua sessão expirou. Faça login novamente para continuar.",
          "erro",
        );
        return;
      }
      mostrarMensagem(
        e.message || "Não foi possível registrar a ocorrência.",
        "erro",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Registro de Ocorrências
        </h1>
        <p className="text-xs text-slate-500 mb-8">
          Central de alertas e logs de suporte emergencial
        </p>

        {erro && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{erro}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm max-w-xl">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Nova Ocorrência
          </h3>
          <form onSubmit={handleRegistrar} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tipo de Evento <span className="text-[#DC3B57]">*</span>
              </label>
              <select
                value={formulario.tipoEvento}
                onChange={(evento) =>
                  alterarCampo("tipoEvento", evento.target.value)
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              >
                <option value="">Selecione um tipo</option>
                {TIPOS_EVENTO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Observações
              </label>
              <textarea
                value={formulario.observacoes}
                onChange={(evento) =>
                  alterarCampo("observacoes", evento.target.value)
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl h-24"
                placeholder="Descreva brevemente o atendimento..."
              />
            </div>
            <button
              type="submit"
              disabled={enviando}
              className="bg-purple-600 text-white font-bold px-5 py-2.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {enviando ? "Registrando..." : "Registrar Ocorrência"}
            </button>
          </form>
        </div>

        <section className="mt-8 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Ocorrências Registradas
            </h3>
            <span className="text-xs font-semibold text-purple-700">
              {ocorrencias.length} registro(s)
            </span>
          </div>

          {carregando ? (
            <p className="py-6 text-sm text-slate-600 text-center">
              Carregando ocorrências...
            </p>
          ) : ocorrencias.length === 0 ? (
            <p className="py-6 text-sm text-slate-600 text-center">
              Nenhuma ocorrência registrada ainda.
            </p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b text-slate-400 uppercase">
                <tr>
                  <th scope="col" className="pb-3 pr-4">
                    Tipo de Evento
                  </th>
                  <th scope="col" className="pb-3 pr-4">Registrado por</th>
                  <th scope="col" className="pb-3 pr-4">Data</th>
                  <th scope="col" className="pb-3">Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ocorrencias.map((ocorrencia) => (
                  <tr key={ocorrencia.id}>
                    <td className="py-3 pr-4 text-slate-700">
                      {ocorrencia.tipoEvento}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {ocorrencia.criadoPor}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {ocorrencia.criadoEm || "—"}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {ocorrencia.observacoes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {mensagem && (
          <div
            role="status"
            aria-live="polite"
            className={`fixed bottom-4 right-4 z-[80] flex w-[calc(100%-32px)] max-w-md items-start gap-3 rounded-xl border p-4 shadow-xl sm:bottom-6 sm:right-6 ${tipoMensagem === "sucesso" ? "border-[#BDE6CC] bg-white" : "border-[#F2C5CF] bg-white"}`}
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tipoMensagem === "sucesso" ? "bg-[#E3F5EA] text-[#2E9E5B]" : "bg-[#FCE7EC] text-[#DC3B57]"}`}
            >
              {tipoMensagem === "sucesso" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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
          </div>
        )}
      </main>
    </>
  );
}
