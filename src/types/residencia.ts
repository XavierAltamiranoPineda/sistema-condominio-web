export interface Residencia {
  idResidencia: number;
  codigoCasa: string;
  idPropietario: number;
  cuotaMensual: number;
  estado: string;
}

export interface ResidenciaRequest {
  codigoCasa: string;
  idPropietario: number;
  cuotaMensual: number;
  estado: string;
}
