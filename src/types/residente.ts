export interface Residente {
  idResidente: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  estado: string;
  createdAt?: string;
}

export interface ResidenteRequest {
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
}
