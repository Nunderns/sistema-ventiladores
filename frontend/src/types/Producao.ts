export interface Producao {
  id: number;
  ventilador_id: number;
  funcionario_id: number;
  data_producao: string;
  turno: string;
}

export interface ProducaoCreate {
  ventilador_id: number;
  funcionario_id: number;
  data_producao: string;
  turno: string;
}
