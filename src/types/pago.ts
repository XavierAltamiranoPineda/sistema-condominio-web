export interface Pago {
  idPago: number;
  idCuota: number;
  codigoCasa: string;
  mes: number;
  anio: number;
  fechaPago: string;
  montoPagado: number;
  estado: string;
}

export interface PagoRequest {
  idCuota: number;
  montoPagado: number;
}
