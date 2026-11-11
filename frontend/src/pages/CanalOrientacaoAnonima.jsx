// Canal de orientação anônima (RF006, RN001, RNF001).
// Página pública: não exige login e não pede dados que identifiquem quem envia.
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../services/api";
import {
  Mail,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const CATEGORIAS = [
  { valor: "direitos", label: "Direitos e legislação" },
  { valor: "violencia", label: "Violência doméstica ou familiar" },
  { valor: "atendimento", label: "Como buscar atendimento" },
  { valor: "outros", label: "Outro assunto" },
];

export default function CanalOrientacaoAnonima() {
  const [mensagem, setMensagem] = useState("");
  const [categoria, setCategoria] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [mostraSucesso, setMostraSucesso] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setErro("");
    setMostraSucesso(false);

    if (!mensagem || mensagem.trim() === "") {
      setErro("Digite sua mensagem antes de enviar.");
      return;
    }

    if (mensagem.trim().length > 2000) {
      setErro("A mensagem deve ter no máximo 2000 caracteres.");
      return;
    }

    if (!categoria) {
      setErro("Selecione uma categoria.");
      return;
    }

    setEnviando(true);

    try {
      // Rota pública: não envia token de autenticação.
      await api.post("/orientacoes-anonimas", {
        mensagem: mensagem.trim(),
        categoria,
      }, { autenticado: false });

      setMostraSucesso(true);
      setMensagem("");
      setCategoria("");
    } catch (e) {
      setErro(
        e.message || "Não foi possível enviar sua mensagem. Tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-navy font-inter">
      <Header />

      <main className="mx-auto max-w-2xl px-5 py-10 sm:px-8 md:py-16">
        <div className="flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand mb-6">
          <Mail size={14} aria-hidden="true" />
          Canal de orientação
        </div>

        <h1 className="text-3xl font-bold mb-2">Precisa de orientação?</h1>
        <p className="mb-8 text-gray-600">
          Conte-nos sua dúvida ou peça orientação. Você não precisa se
          identificar: não solicitamos nome, CPF ou telefone.
        </p>

        {mostraSucesso ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-3 rounded-xl border border-[#BDE6CC] bg-[#F0FBF4] p-5 mb-6"
          >
            <CheckCircle2 size={22} className="shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <h2 className="font-bold text-emerald-800">Mensagem enviada!</h2>
              <p className="mt-1 text-sm leading-6 text-emerald-700">
                Sua orientação foi recebida de forma anônima. Não armazenamos
                dados que identifiquem quem enviou.
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={enviar}
            className="space-y-4 rounded-2xl border border-brand/15 bg-white p-5 shadow-sm sm:p-6"
          >
            {erro && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-700" />
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="mensagem"
                className="block text-sm font-semibold text-navy mb-2"
              >
                Sua mensagem *
              </label>
              <textarea
                id="mensagem"
                rows="5"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Ex.: gostaria de saber quais são meus direitos..."
                className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy transition placeholder:text-navy/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <p className="mt-1 text-xs text-gray-500">
                Não informe nomes, CPF, telefone ou outros dados que identifiquem
                você.
              </p>
            </div>

            <div>
              <label
                htmlFor="categoria"
                className="block text-sm font-semibold text-navy mb-2"
              >
                Categoria *
              </label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="">Selecione uma categoria</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat.valor} value={cat.valor}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Send size={18} aria-hidden="true" />
              {enviando ? "Enviando..." : "Enviar mensagem"}
            </button>
          </form>
        )}

        <div className="mt-10 rounded-2xl border border-brand/10 bg-brand/5 p-5 sm:p-6">
          <h3 className="font-semibold text-navy mb-2">Precisa de ajuda imediata?</h3>
          <p className="mb-4 text-sm text-gray-600">
            Em situação de emergência, ligue diretamente para os canais abaixo.
            A ligação é gratuita e sigilosa.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:180"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Ligar 180
            </a>
            <a
              href="tel:190"
              className="inline-flex items-center gap-2 rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Ligar 190
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
