import { useEffect, useState } from "react";
import api from "../api/api";
import type { Producao, ProducaoCreate } from "../types/Producao";
import ProducaoCard from "../components/ProducaoCard";

export default function ProducaoPage() {
  const [producao, setProducao] = useState<Producao[]>([]);
  const [ventiladorId, setVentiladorId] = useState("");
  const [funcionarioId, setFuncionarioId] = useState("");
  const [dataProducao, setDataProducao] = useState("");
  const [turno, setTurno] = useState("");

  useEffect(() => {
    api.get<Producao[]>("/producao")
      .then((res: { data: Producao[] }) => setProducao(res.data))
      .catch((err: Error) => console.error("Erro ao buscar produção:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novo: ProducaoCreate = {
      ventilador_id: Number(ventiladorId),
      funcionario_id: Number(funcionarioId),
      data_producao: dataProducao,
      turno
    };

    try {
      const res = await api.post<Producao>("/producao", novo);
      setProducao((prev) => [...prev, res.data]);
      setVentiladorId("");
      setFuncionarioId("");
      setDataProducao("");
      setTurno("");
    } catch (err) {
      console.error("Erro ao criar produção:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">🏭 Produção</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow max-w-lg">
        <input
          type="number"
          placeholder="ID do Ventilador"
          value={ventiladorId}
          onChange={(e) => setVentiladorId(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="number"
          placeholder="ID do Funcionário"
          value={funcionarioId}
          onChange={(e) => setFuncionarioId(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="date"
          value={dataProducao}
          onChange={(e) => setDataProducao(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="text"
          placeholder="Turno"
          value={turno}
          onChange={(e) => setTurno(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">
          Adicionar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {producao.map((p) => (
          <ProducaoCard key={p.id} producao={p} />
        ))}
      </div>
    </div>
  );
}
