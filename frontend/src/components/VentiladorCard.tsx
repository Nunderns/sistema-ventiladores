import type { Ventilador } from "../types/Ventilador";

interface Props {
  ventilador: Ventilador;
  onEdit?: (v: Ventilador) => void;
  onDelete?: (id: number) => void;
}

export default function VentiladorCard({ ventilador, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white p-4 shadow rounded border">
      <h2 className="text-lg font-semibold">{ventilador.modelo}</h2>
      <p className="text-gray-700">Nº Série: {ventilador.numero_serie}</p>
      <p className="text-gray-700">
        Fabricação: {new Date(ventilador.data_fabricacao).toLocaleDateString()}
      </p>
      <p className="text-green-600 font-medium">Status: {ventilador.status}</p>
      <div className="mt-3 flex gap-2">
        {onEdit && (
          <button
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
            onClick={() => onEdit(ventilador)}
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            onClick={() => onDelete(ventilador.id)}
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}

