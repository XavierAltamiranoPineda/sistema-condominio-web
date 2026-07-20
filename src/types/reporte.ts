export interface Novedad {
  tipo: string;
  descripcion: string;
  datos: any;
}

export interface ReporteGeneral {
  estado: string; // 'OK' | 'ALERTA'
  mensaje?: string;
  novedades?: Novedad[];
}
