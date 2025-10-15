import type { Producao } from "../types/Producao";

interface Props {
  producao: Producao;
}

export default function ProducaoCard({ producao }: Props) {
  return (
    <div className="bg-white p-4 shadow rounded border">
      <h2 className="text-lg font-semibold">Produção #{producao.id}</h2>
      <p>Ventilador ID: {producao.ventilador_id}</p>
      <p>Funcionário ID: {producao.funcionario_id}</p>
      <p>
        Data: {new Date(producao.data_producao).toLocaleDateString()}
      </p>
      <p>Turno: {producao.turno}</p>
    </div>
  );
}
