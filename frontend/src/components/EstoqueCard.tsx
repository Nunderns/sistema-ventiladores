import type { Estoque } from "../types/Estoque";

interface Props {
  estoque: Estoque;
}

export default function EstoqueCard({ estoque }: Props) {
  return (
    <div className="bg-white p-4 shadow rounded border">
      <h2 className="text-lg font-semibold">Estoque #{estoque.id}</h2>
      <p>Ventilador ID: {estoque.ventilador_id}</p>
      <p>Quantidade: {estoque.quantidade}</p>
      <p>Localização: {estoque.localizacao}</p>
      <p>
        Entrada: {new Date(estoque.data_entrada).toLocaleDateString()}
      </p>
    </div>
  );
}
