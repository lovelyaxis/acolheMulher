// Card de unidade de atendimento para a consulta pública (RF003) e interna (RF012).
// As vagas só são exibidas quando `mostrarVagas` é verdadeiro.
import { BedDouble, Clock, MapPin, Phone } from "lucide-react";

const formatarCep = (cep = "") => {
  const digitos = String(cep).replace(/\D/g, "");

  if (digitos.length !== 8) return String(cep);

  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
};

const linkTelefone = (telefone = "") =>
  `tel:${String(telefone).replace(/\D/g, "")}`;

export default function CardUnidade({ unidade, mostrarVagas = false }) {
  if (!unidade) return null;

  const { nome, tipo, endereco, bairro, cep, telefone, horario } = unidade;
  const { vagasTotal, vagasDisponiveis } = unidade;

  const exibirVagas =
    mostrarVagas &&
    tipo === "Casa de Acolhimento" &&
    Number.isFinite(vagasTotal) &&
    Number.isFinite(vagasDisponiveis) &&
    vagasTotal >= 0 &&
    vagasDisponiveis >= 0 &&
    vagasDisponiveis <= vagasTotal;

  const textoVagas =
    vagasDisponiveis > 0
      ? `${vagasDisponiveis} de ${vagasTotal} vagas disponíveis`
      : "Nenhuma vaga disponível no momento";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-colors hover:border-brand/50">
      <p className="inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        {tipo}
      </p>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">
        {nome}
      </h3>

      <address className="mt-3 flex items-start gap-2 text-sm not-italic leading-6 text-muted">
        <MapPin
          className="mt-0.5 h-4 w-4 shrink-0 text-brand"
          aria-hidden="true"
        />

        <span>
          {endereco}

          <span className="block text-muted">
            {bairro} — CEP {formatarCep(cep)}
          </span>
        </span>
      </address>

      <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted">
        <Phone
          className="mt-0.5 h-4 w-4 shrink-0 text-brand"
          aria-hidden="true"
        />

        <a
          href={linkTelefone(telefone)}
          aria-label={`Ligar para ${nome} pelo telefone ${telefone}`}
          className="rounded font-semibold text-brand underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {telefone}
        </a>
      </p>

      <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted">
        <Clock
          className="mt-0.5 h-4 w-4 shrink-0 text-brand"
          aria-hidden="true"
        />

        <span>{horario}</span>
      </p>

      {exibirVagas && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-page px-4 py-3 text-sm font-medium text-ink">
          <BedDouble
            className="mt-0.5 h-4 w-4 shrink-0 text-brand"
            aria-hidden="true"
          />

          <span>{textoVagas}</span>
        </p>
      )}
    </article>
  );
}
