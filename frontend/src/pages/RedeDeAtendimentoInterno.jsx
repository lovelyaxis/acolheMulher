// Consulta interna da rede de atendimento (RF012).
// Exclusiva para profissionais e administradores logados. Mostra as vagas
// das Casas de Acolhimento, que não aparecem na consulta pública (RF003).
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import BuscaUnidades from "../components/BuscaUnidades";
import { listarUnidadesInternas } from "../services/unidadesService";
import { useAuth } from "../auth/AuthContext";

export default function RedeDeAtendimentoInterno() {
  const { usuario, perfil } = useAuth();

  const painel =
    perfil === "ADMINISTRADOR"
      ? "/dashboard-admin"
      : "/dashboard-profissional";

  return (
    <main className="min-h-screen bg-page text-navy">
      <div className="border-b border-brand/10 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <Link
            to={painel}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-brand transition hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao painel
          </Link>

          <p className="text-xs font-semibold text-gray-600">
            {usuario?.nome
              ? `${usuario.nome} — ${
                  perfil === "ADMINISTRADOR" ? "Administrador" : "Profissional"
                }`
              : "Área interna"}
          </p>
        </div>
      </div>

      <section className="px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Uso interno
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Rede de atendimento
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-700 sm:text-base">
            Consulte as unidades da rede e a disponibilidade de vagas nas
            Casas de Acolhimento. Use estas informações para orientar
            encaminhamentos com mais segurança e acolhimento.
          </p>

          <div className="mt-5 max-w-3xl rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm leading-6 text-gray-700 sm:p-5">
            <p>
              Estes dados são de uso interno da rede de proteção. Compartilhe
              apenas o necessário para o atendimento, preservando o sigilo de
              quem procura ajuda.
            </p>
          </div>

          <BuscaUnidades
            buscar={listarUnidadesInternas}
            mostrarVagas
            idPrefixo="interna-busca"
          />

          <p className="mt-6 text-xs leading-5 text-gray-600">
            A disponibilidade de vagas pode mudar ao longo do dia. Confirme
            com a unidade por telefone antes de encaminhar.
          </p>
        </div>
      </section>
    </main>
  );
}
