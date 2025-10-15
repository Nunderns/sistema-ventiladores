export interface Estoque {
  id: number;
  ventilador_id: number;
  quantidade: number;
  localizacao: string;
  data_entrada: string;
}

export interface EstoqueCreate {
  ventilador_id: number;
  quantidade: number;
  localizacao: string;
  data_entrada?: string;
}
