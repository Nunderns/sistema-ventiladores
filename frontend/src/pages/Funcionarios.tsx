import { useEffect, useState } from "react";
import api from "../api/api";
import type { Funcionario, FuncionarioCreate } from "../types/Funcionario";
import FuncionarioCard from "../components/FuncionarioCard";

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");

  useEffect(() => {
    api.get<Funcionario[]>("/funcionarios")
      .then((res: { data: Funcionario[] }) => setFuncionarios(res.data))
      .catch((err: Error) => console.error("Erro ao buscar funcionários:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novo: FuncionarioCreate = {
      nome,
      cargo,
      cpf,
      data_admissao: dataAdmissao,
      ativo: true
    };

    try {
      const res = await api.post<Funcionario>("/funcionarios", novo);
      setFuncionarios((prev) => [...prev, res.data]);
      setNome("");
      setCargo("");
      setCpf("");
      setDataAdmissao("");
    } catch (err) {
      console.error("Erro ao criar funcionário:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirma excluir o funcionário?")) return;
    try {
      await api.delete(`/funcionarios/${id}`);
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Erro ao excluir funcionário:", err);
    }
  };

  const handleEdit = async (f: Funcionario) => {
    const novoNome = prompt("Nome", f.nome) ?? f.nome;
    const novoCargo = prompt("Cargo", f.cargo) ?? f.cargo;
    const novoCpf = prompt("CPF", f.cpf) ?? f.cpf;
    const novaData = prompt("Data de admissão (YYYY-MM-DD)", f.data_admissao.slice(0,10)) ?? f.data_admissao;
    try {
      const res = await api.put(`/funcionarios/${f.id}`, {
        nome: novoNome,
        cargo: novoCargo,
        cpf: novoCpf,
        data_admissao: novaData,
        ativo: f.ativo,
      });
      setFuncionarios((prev) => prev.map((x) => (x.id === f.id ? res.data : x)));
    } catch (err) {
      console.error("Erro ao editar funcionário:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">👷 Funcionários</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow max-w-lg">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="text"
          placeholder="Cargo"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="date"
          value={dataAdmissao}
          onChange={(e) => setDataAdmissao(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Adicionar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funcionarios.map((f) => (
          <FuncionarioCard key={f.id} funcionario={f} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
