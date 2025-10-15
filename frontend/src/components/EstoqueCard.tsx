import type { Estoque } from "../types/Estoque";

interface Props {
  estoque: Estoque;
  onEdit?: (e: Estoque) => void;
  onDelete?: (id: number) => void;
}

export default function EstoqueCard({ estoque, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white p-4 shadow rounded border">
      <h2 className="text-lg font-semibold">Estoque #{estoque.id}</h2>
      <p>Ventilador ID: {estoque.ventilador_id}</p>
      <p>Quantidade: {estoque.quantidade}</p>
      <p>Localização: {estoque.localizacao}</p>
      <p>Entrada: {new Date(estoque.data_entrada).toLocaleDateString()}</p>
      <div className="mt-3 flex gap-2">
        {onEdit && (
          <button
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
            onClick={() => onEdit(estoque)}
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            onClick={() => onDelete(estoque.id)}
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}

