import type { Funcionario } from "../types/Funcionario";

interface Props {
  funcionario: Funcionario;
  onEdit?: (f: Funcionario) => void;
  onDelete?: (id: number) => void;
}

export default function FuncionarioCard({ funcionario, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white p-4 shadow rounded border">
      <h2 className="text-lg font-semibold">{funcionario.nome}</h2>
      <p className="text-gray-700">Cargo: {funcionario.cargo}</p>
      <p className="text-gray-700">CPF: {funcionario.cpf}</p>
      <p className="text-gray-700">
        Admissão: {new Date(funcionario.data_admissao).toLocaleDateString()}
      </p>
      <p className={funcionario.ativo ? "text-green-600" : "text-red-600"}>
        {funcionario.ativo ? "Ativo" : "Inativo"}
      </p>
      <div className="mt-3 flex gap-2">
        {onEdit && (
          <button
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
            onClick={() => onEdit(funcionario)}
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            onClick={() => onDelete(funcionario.id)}
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}

