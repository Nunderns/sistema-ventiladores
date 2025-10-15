import { useEffect, useState } from "react";
import api from "../api/api";
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

  const carregarVentiladores = async () => {
    try {
      const res = await api.get<Ventilador[]>("/ventiladores");
      setVentiladores(res.data);
    } catch (err) {
      console.error("Erro ao carregar ventiladores:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novoVentilador: VentiladorCreate = {
      modelo,
      numero_serie: numeroSerie,
      data_fabricacao: dataFabricacao,
      funcionario_id: 1,
    };
    try {
      await api.post<Ventilador>("/ventiladores", novoVentilador);
      await carregarVentiladores();
      setModelo("");
      setNumeroSerie("");
      setDataFabricacao("");
    } catch (err) {
      console.error("Erro ao criar ventilador:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirma excluir o ventilador?")) return;
    try {
      await api.delete(`/ventiladores/${id}`);
      await carregarVentiladores();
    } catch (err) {
      console.error("Erro ao excluir ventilador:", err);
    }
  };

  const handleEdit = async (v: Ventilador) => {
    const novoModelo = prompt("Modelo", v.modelo) ?? v.modelo;
    const novoNumero = prompt("Número de série", v.numero_serie) ?? v.numero_serie;
    const novaData = prompt("Data de fabricação (YYYY-MM-DD)", v.data_fabricacao.slice(0,10)) ?? v.data_fabricacao;
    try {
      await api.put(`/ventiladores/${v.id}`,
        { modelo: novoModelo, numero_serie: novoNumero, data_fabricacao: novaData, funcionario_id: v.funcionario_id }
      );
      await carregarVentiladores();
    } catch (err) {
      console.error("Erro ao editar ventilador:", err);
    }
  };

  // Carregar ventiladores ao montar o componente
  useEffect(() => {
    carregarVentiladores();
  }, []);

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
          <VentiladorCard key={v.id} ventilador={v} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
