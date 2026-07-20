export interface LoginRequest {
  usuario: string;
  password: string;
}


export interface AuthResponse {
  token: string;
  usuario: string;
  idUsuario: number;
  roles: string[];
}


export interface User {
  idUsuario: number;
  usuario: string;
  roles: string[];
}