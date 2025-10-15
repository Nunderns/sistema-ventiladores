export interface Ventilador {
  id: number;
  modelo: string;
  numero_serie: string;
  data_fabricacao: string;
  status: string;
  funcionario_id?: number;
}

export interface VentiladorCreate {
  modelo: string;
  numero_serie: string;
  data_fabricacao: string;
  funcionario_id?: number;
}
