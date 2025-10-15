import { useEffect, useState } from "react";
import { api } from "../api/api";
import type { Ventilador, VentiladorCreate } from "../types/Ventilador";
import VentiladorCard from "../components/VentiladorCard";

export default function Ventiladores() {
  const [ventiladores, setVentiladores] = useState<Ventilador[]>([]);
  const [modelo, setModelo] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [dataFabricacao, setDataFabricacao] = useState("");

  useEffect(() => {
    api.get<Ventilador[]>("/ventiladores")
      .then((res) => setVentiladores(res.data))
      .catch((err) => console.error("Erro ao carregar ventiladores:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novoVentilador: VentiladorCreate = {
      modelo,
      numero_serie: numeroSerie,
      data_fabricacao: dataFabricacao,
      funcionario_id: 1,
    };
    try {
      const res = await api.post<Ventilador>("/ventiladores", novoVentilador);
      setVentiladores((prev) => [...prev, res.data]);
      setModelo("");
      setNumeroSerie("");
      setDataFabricacao("");
    } catch (err) {
      console.error("Erro ao criar ventilador:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">🧊 Ventiladores</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow max-w-lg">
        <div className="mb-3">
          <label className="block font-medium mb-1">Modelo</label>
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium mb-1">Número de Série</label>
          <input
            type="text"
            value={numeroSerie}
            onChange={(e) => setNumeroSerie(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium mb-1">Data de Fabricação</label>
          <input
            type="date"
            value={dataFabricacao}
            onChange={(e) => setDataFabricacao(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Adicionar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ventiladores.map((v) => (
          <VentiladorCard key={v.id} ventilador={v} />
        ))}
      </div>
    </div>
  );
}
