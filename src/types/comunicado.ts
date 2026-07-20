export interface Comunicado {
  idComunicado: number;
  titulo: string;
  mensaje: string;
  prioridad: string; // 'ALTA' | 'NORMAL' | 'BAJA'
  fechaVencimiento?: string;
  createdAt: string;
}

export interface ComunicadoRequest {
  titulo: string;
  mensaje: string;
  prioridad?: string;
  fechaVencimiento?: string;
  destinatarios?: number[]; // IDs de residentes destinatarios (vacío = enviar a todos)
}
