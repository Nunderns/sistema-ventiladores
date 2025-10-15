import type { Producao } from "../types/Producao";

interface Props {
  producao: Producao;
  onEdit?: (p: Producao) => void;
  onDelete?: (id: number) => void;
}

export default function ProducaoCard({ producao, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white p-4 shadow rounded border">
      <h2 className="text-lg font-semibold">Produção #{producao.id}</h2>
      <p>Ventilador ID: {producao.ventilador_id}</p>
      <p>Funcionário ID: {producao.funcionario_id}</p>
      <p>Data: {new Date(producao.data_producao).toLocaleDateString()}</p>
      <p>Turno: {producao.turno}</p>
      <div className="mt-3 flex gap-2">
        {onEdit && (
          <button
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
            onClick={() => onEdit(producao)}
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            onClick={() => onDelete(producao.id)}
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}

