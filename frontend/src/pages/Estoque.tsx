import { useEffect, useState } from "react";
import api from "../api/api";
import type { Estoque, EstoqueCreate } from "../types/Estoque";
import EstoqueCard from "../components/EstoqueCard";

export default function EstoquePage() {
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [ventiladorId, setVentiladorId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");

  useEffect(() => {
    api.get<Estoque[]>("/estoque")
      .then((res: { data: Estoque[] }) => setEstoque(res.data))
      .catch((err: Error) => console.error("Erro ao buscar estoque:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novo: EstoqueCreate = {
      ventilador_id: Number(ventiladorId),
      quantidade: Number(quantidade),
      localizacao
    };

    try {
      const res = await api.post<Estoque>("/estoque", novo);
      setEstoque((prev) => [...prev, res.data]);
      setVentiladorId("");
      setQuantidade("");
      setLocalizacao("");
    } catch (err) {
      console.error("Erro ao adicionar estoque:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirma excluir o item do estoque?")) return;
    try {
      await api.delete(`/estoque/${id}`);
      setEstoque((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Erro ao excluir item do estoque:", err);
    }
  };

  const handleEdit = async (e: Estoque) => {
    const novoVent = prompt("Ventilador ID", String(e.ventilador_id)) ?? String(e.ventilador_id);
    const novaQtd = prompt("Quantidade", String(e.quantidade)) ?? String(e.quantidade);
    const novaLoc = prompt("Localização", e.localizacao) ?? e.localizacao;
    const novaData = prompt("Data de entrada (YYYY-MM-DD)", e.data_entrada.slice(0,10)) ?? e.data_entrada;
    try {
      const res = await api.put(`/estoque/${e.id}`, {
        ventilador_id: Number(novoVent),
        quantidade: Number(novaQtd),
        localizacao: novaLoc,
        data_entrada: novaData,
      });
      setEstoque((prev) => prev.map((x) => (x.id === e.id ? res.data : x)));
    } catch (err) {
      console.error("Erro ao editar item do estoque:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">📦 Estoque</h1>

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
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="text"
          placeholder="Localização"
          value={localizacao}
          onChange={(e) => setLocalizacao(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          Adicionar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {estoque.map((e) => (
          <EstoqueCard key={e.id} estoque={e} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
