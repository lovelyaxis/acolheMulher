
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  ClipboardList,
  Send,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_URL = "http://localhost:3000";

// Identificador fictício do profissional para o protótipo.
// Na versão real, deve vir da autenticação.
const PROFISSIONAL_ID = "prof-demo-001";

const servicosDisponiveis = [
  "Assistência social",
  "Apoio psicológico",
  "Orientação jurídica",
  "Atendimento de saúde",
  "Acolhimento especializado",
];

export default function RegistrarEncaminhamento() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    servico: "",
    destino: "",
    observacoes: "",
  });

  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState([]);
  const [carregandoUnidades, setCarregandoUnidades] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [erroApi, setErroApi] = useState("");

  // Buscar as unidades no backend quando abrir o formulário.
  useEffect(() => {
    async function carregarUnidades() {
      try {
        setCarregandoUnidades(true);
        setErroApi("");

        const resposta = await fetch(`${API_URL}/api/unidades`);

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar as unidades.");
        }

        const dados = await resposta.json();

        setUnidadesDisponiveis(
          dados.filter((unidade) => unidade.ativa === true)
        );
      } catch (erro) {
        setErroApi(
          "Não foi possível carregar as unidades. Confira se o backend está funcionando."
        );
      } finally {
        setCarregandoUnidades(false);
      }
    }

    carregarUnidades();
  }, []);

  function alterarCampo(campo, valor) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setErros((anteriores) => ({
      ...anteriores,
      [campo]: "",
    }));

    setErroApi("");
  }

  async function registrarEncaminhamento(evento) {
    evento.preventDefault();

    const novosErros = {};

    if (!formulario.servico) {
      novosErros.servico = "Selecione o tipo de atendimento.";
    }

    if (!formulario.destino) {
      novosErros.destino = "Selecione a unidade de destino.";
    }

    if (formulario.observacoes.length > 1000) {
      novosErros.observacoes =
        "As observações devem ter no máximo 1000 caracteres.";
    }

    setErros(novosErros);
    setErroApi("");

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    // Gerar um código fictício para identificar o caso.
    const codigoCaso = `AM-${Date.now()}`;

    // Enviar o ID da unidade, não apenas seu nome.
    const dadosEnvio = {
      codigoCaso,
      tipoAtendimento: formulario.servico,
      unidadeDestinoId: formulario.destino,
      observacoes: formulario.observacoes.trim(),
      profissionalId: PROFISSIONAL_ID,
    };

    try {
      setEnviando(true);

      const resposta = await fetch(`${API_URL}/api/encaminhamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosEnvio),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro || "Não foi possível registrar o encaminhamento."
        );
      }

      const encaminhamentoApi = resultado.encaminhamento;
      const unidadeSelecionada = unidadesDisponiveis.find(
        (unidade) => unidade.id === formulario.destino
      );

      // Guardar também na sessão do navegador para manter
      // compatibilidade com partes existentes do frontend.
      // O registro oficial desta operação foi enviado à API.
      const chave = "acolheMulherEncaminhamentos";

      const encaminhamentosSalvos = JSON.parse(
        sessionStorage.getItem(chave) || "[]"
      );

      const novoEncaminhamento = {
        codigo: codigoCaso,
        codigoCaso: encaminhamentoApi.codigoCaso,
        servico: encaminhamentoApi.tipoAtendimento,
        destino: unidadeSelecionada?.nome || formulario.destino,
        unidadeDestinoId: encaminhamentoApi.unidadeDestinoId,
        data: new Date().toLocaleDateString("pt-BR"),
        status: "Pendente",
        observacoes: encaminhamentoApi.observacoes,
        profissionalId: encaminhamentoApi.profissionalId,
        id: encaminhamentoApi.id,
      };

      sessionStorage.setItem(
        chave,
        JSON.stringify([
          novoEncaminhamento,
          ...encaminhamentosSalvos,
        ])
      );

      setMensagem(
        `Encaminhamento ${codigoCaso} registrado com sucesso no backend.`
      );
    } catch (erro) {
      setErroApi(
        erro.message ||
          "Não foi possível conectar ao backend. Tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  function voltarAoDashboard() {
    navigate("/dashboard-profissional");
  }

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
            onClick={voltarAoDashboard}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#7B3FA6] transition hover:bg-purple-50"
          >
            <ArrowLeft size={17} />
            Voltar ao painel
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7B3FA6]">
            Painel do profissional
          </p>

          <h1 className="mt-2 font-poppins text-2xl font-bold text-slate-900 sm:text-3xl">
            Registrar encaminhamento
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#716A88]">
            Preencha os dados demonstrativos para registrar
            um novo encaminhamento na rede de atendimento.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#EAE3F4] p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0E5FA] text-[#7B3FA6]">
              <ClipboardList size={22} />
            </div>

            <div>
              <h2 className="font-poppins font-bold">
                Dados do encaminhamento
              </h2>
              <p className="mt-1 text-xs text-[#827A99]">
                Os campos marcados com * são obrigatórios.
              </p>
            </div>
          </div>

          {mensagem ? (
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3 rounded-xl border border-[#BDE6CC] bg-[#F0FBF4] p-4">
                <CheckCircle2
                  size={22}
                  className="shrink-0 text-emerald-600"
                />
                <div>
                  <h2 className="font-bold text-emerald-800">
                    Encaminhamento registrado!
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-emerald-700">
                    {mensagem}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={voltarAoDashboard}
                className="mt-5 w-full rounded-full bg-[#7B3FA6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#63308A]"
              >
                Voltar ao dashboard
              </button>
            </div>
          ) : (
            <form
              onSubmit={registrarEncaminhamento}
              noValidate
              className="space-y-5 p-5 sm:p-6"
            >
              {erroApi && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{erroApi}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="servico"
                  className="mb-2 block text-sm font-semibold"
                >
                  Tipo de atendimento{" "}
                  <span className="text-[#DC3B57]">*</span>
                </label>

                <select
                  id="servico"
                  value={formulario.servico}
                  onChange={(evento) =>
                    alterarCampo("servico", evento.target.value)
                  }
                  aria-invalid={Boolean(erros.servico)}
                  className={`w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-100 ${
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
                  <p className="mt-1.5 text-xs text-[#DC3B57]">
                    {erros.servico}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="destino"
                  className="mb-2 block text-sm font-semibold"
                >
                  Unidade de destino{" "}
                  <span className="text-[#DC3B57]">*</span>
                </label>

                <select
                  id="destino"
                  value={formulario.destino}
                  onChange={(evento) =>
                    alterarCampo("destino", evento.target.value)
                  }
                  disabled={
                    carregandoUnidades || unidadesDisponiveis.length === 0
                  }
                  aria-invalid={Boolean(erros.destino)}
                  className={`w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-100 ${
                    erros.destino
                      ? "border-[#DC3B57]"
                      : "border-[#E5DFEF] focus:border-[#7B3FA6]"
                  }`}
                >
                  <option value="">
                    {carregandoUnidades
                      ? "Carregando unidades..."
                      : "Selecione uma unidade"}
                  </option>

                  {unidadesDisponiveis.map((unidade) => (
                    <option key={unidade.id} value={unidade.id}>
                      {unidade.nome}
                    </option>
                  ))}
                </select>

                {erros.destino && (
                  <p className="mt-1.5 text-xs text-[#DC3B57]">
                    {erros.destino}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="observacoes"
                  className="mb-2 block text-sm font-semibold"
                >
                  Observações{" "}
                  <span className="font-normal text-gray-400">
                    (opcional)
                  </span>
                </label>

                <textarea
                  id="observacoes"
                  rows={4}
                  maxLength={1000}
                  value={formulario.observacoes}
                  onChange={(evento) =>
                    alterarCampo("observacoes", evento.target.value)
                  }
                  placeholder="Informações gerais, sem dados pessoais identificáveis"
                  aria-invalid={Boolean(erros.observacoes)}
                  className="w-full resize-y rounded-xl border border-[#E5DFEF] px-3 py-3 text-sm outline-none placeholder:text-[#A19AAF] focus:border-[#7B3FA6] focus:ring-2 focus:ring-purple-100"
                />

                {erros.observacoes && (
                  <p className="mt-1.5 text-xs text-[#DC3B57]">
                    {erros.observacoes}
                  </p>
                )}

                <p className="mt-1 text-right text-xs text-[#948CA8]">
                  {formulario.observacoes.length}/1000
                </p>
              </div>

              <div className="rounded-xl bg-[#F5F0FC] p-3">
                <p className="flex items-start gap-2 text-xs leading-5 text-[#625879]">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-[#7B3FA6]"
                  />
                  Não informe nomes, CPF, endereços ou outros dados
                  que identifiquem a pessoa atendida. Este formulário
                  é demonstrativo.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={voltarAoDashboard}
                  disabled={enviando}
                  className="min-h-11 rounded-full border border-[#E5DFEF] px-5 py-3 text-sm font-semibold text-[#625879] transition hover:bg-[#F5F0FC] disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={enviando || carregandoUnidades}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#7B3FA6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#63308A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={16} />
                  {enviando
                    ? "Enviando..."
                    : "Registrar encaminhamento"}
                </button>
              </div>
            </form>
          )}
        </section>

        <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#827A99]">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          Os dados são fictícios. O encaminhamento é enviado à API
          do protótipo e também fica temporariamente na sessão do
          navegador. A API atual mantém os registros em memória.
        </p>
      </main>
    </div>
  );
}
