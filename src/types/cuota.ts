export interface Cuota {
  idCuota: number;
  idResidencia: number;
  codigoCasa: string;
  mes: number;
  anio: number;
  valor: number;
  montoPagado: number;
  saldoPendiente: number;
}

export interface CuotaRequest {
  idResidencia: number;
  mes: number;
  anio: number;
  valor: number;
}
