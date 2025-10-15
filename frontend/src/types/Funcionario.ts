export interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  cpf: string;
  data_admissao: string;
  ativo: boolean;
}

export interface FuncionarioCreate {
  nome: string;
  cargo: string;
  cpf: string;
  data_admissao: string;
  ativo?: boolean;
}
