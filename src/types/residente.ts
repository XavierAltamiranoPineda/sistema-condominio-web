/**
 * Respuesta del backend para un residente.
 * Mapeada desde ResidenteResponse.java
 */
export interface Residente {
  idResidente: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  /** ACTIVO | INACTIVO */
  estado: string;
  createdAt?: string;
}

/**
 * Request para crear o actualizar un residente.
 * Mapeado desde ResidenteRequest.java
 *
 * Campos del backend:
 *  - nombres:   @NotBlank, max 100
 *  - apellidos: @NotBlank, max 100
 *  - cedula:    @NotBlank, exactly 10 numeric digits
 *  - telefono:  @Size max 15 (opcional en backend)
 *
 * Nota: el campo 'estado' solo se envía en operaciones de activación
 * (PUT con estado=ACTIVO). Al crear, el backend lo pone ACTIVO por defecto.
 */
export interface ResidenteRequest {
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  /** Solo para cambiar estado vía PUT. No se envía en creación. */
  estado?: string;
}
