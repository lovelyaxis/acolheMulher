import { useCallback, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  atualizarStatusEncaminhamento,
  listarEncaminhamentos,
} from '../services/encaminhamentosService';

const FILTROS_STATUS = [
  { valor: '', rotulo: 'Todos' },
  { valor: 'PENDENTE', rotulo: 'Pendente' },
  { valor: 'CONCLUIDO', rotulo: 'Concluído' },
];

const OPCOES_STATUS = [
  { valor: 'PENDENTE', rotulo: 'Pendente' },
  { valor: 'CONCLUIDO', rotulo: 'Concluído' },
];

export default function GestaoEncaminhamentos() {
  const [encaminhamentos, setEncaminhamentos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [atualizandoId, setAtualizandoId] = useState(null);

  const carregarEncaminhamentos = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      const lista = await listarEncaminhamentos(filtroStatus || undefined);
      setEncaminhamentos(lista);
    } catch (e) {
      setEncaminhamentos([]);
      setErro(e.message || 'Não foi possível carregar os encaminhamentos.');
    } finally {
      setCarregando(false);
    }
  }, [filtroStatus]);

  useEffect(() => {
    const temporizador = setTimeout(carregarEncaminhamentos, 0);
    return () => clearTimeout(temporizador);
  }, [carregarEncaminhamentos]);

  async function handleAtualizarStatus(encaminhamento, status) {
    if (encaminhamento.statusCodigo === status) return;

    setAtualizandoId(encaminhamento.id);
    setErro('');

    try {
      const atualizado = await atualizarStatusEncaminhamento(
        encaminhamento.id,
        status,
      );
      setEncaminhamentos((atuais) =>
        atuais.map((item) =>
          item.id === atualizado.id ? atualizado : item,
        ),
      );
    } catch (e) {
      setErro(e.message || 'Não foi possível atualizar o status.');
    } finally {
      setAtualizandoId(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-purple-50/50 font-sans">
      <Sidebar activePath="/admin/encaminhamentos" />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Gestão de Encaminhamentos
        </h1>
        <p className="mb-8 text-xs text-slate-500">
          Acompanhamento de solicitações e encaminhamento de assistência
        </p>

        <section className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-2 sm:max-w-xs">
            <label
              htmlFor="filtro-status-encaminhamentos"
              className="text-xs font-semibold text-slate-700"
            >
              Filtrar por status
            </label>
            <select
              id="filtro-status-encaminhamentos"
              value={filtroStatus}
              onChange={(evento) => setFiltroStatus(evento.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {FILTROS_STATUS.map((filtro) => (
                <option key={filtro.valor} value={filtro.valor}>
                  {filtro.rotulo}
                </option>
              ))}
            </select>
          </div>

          {erro && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p>{erro}</p>
              <button
                type="button"
                onClick={carregarEncaminhamentos}
                className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 font-medium"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {carregando ? (
            <p role="status" className="py-6 text-sm text-slate-600">
              Carregando encaminhamentos...
            </p>
          ) : encaminhamentos.length === 0 ? (
            <p role="status" className="py-6 text-sm text-slate-600">
              Nenhum encaminhamento encontrado para este filtro.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <caption className="sr-only">
                  Encaminhamentos com código do caso, data, tipo, unidade de destino e status.
                </caption>
                <thead>
                  <tr className="border-b text-slate-400 uppercase">
                    <th scope="col" className="pb-3 pr-4">Código do caso</th>
                    <th scope="col" className="pb-3 pr-4">Data</th>
                    <th scope="col" className="pb-3 pr-4">Tipo de apoio</th>
                    <th scope="col" className="pb-3 pr-4">Unidade de destino</th>
                    <th scope="col" className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {encaminhamentos.map((encaminhamento) => (
                    <tr key={encaminhamento.id}>
                      <td className="py-3 pr-4 font-semibold text-slate-800">
                        {encaminhamento.codigo}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {encaminhamento.data || '—'}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {encaminhamento.servico}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {encaminhamento.destino}
                      </td>
                      <td className="py-3">
                        <label
                          className="sr-only"
                          htmlFor={`status-${encaminhamento.id}`}
                        >
                          Status do caso {encaminhamento.codigo}
                        </label>
                        <select
                          id={`status-${encaminhamento.id}`}
                          value={encaminhamento.statusCodigo}
                          disabled={atualizandoId === encaminhamento.id}
                          onChange={(evento) =>
                            handleAtualizarStatus(
                              encaminhamento,
                              evento.target.value,
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-medium text-purple-700 disabled:opacity-60"
                        >
                          {OPCOES_STATUS.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                              {opcao.rotulo}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
