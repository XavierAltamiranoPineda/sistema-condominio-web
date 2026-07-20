/**
 * Respuesta del backend para una residencia.
 * Mapeada desde ResidenciaResponse.java
 */
export interface Residencia {
  idResidencia: number;
  codigoCasa: string;
  idPropietario: number;
  nombrePropietario?: string;
  cuotaMensual: number;
  /** OCUPADA | DESOCUPADA */
  estado: string;
  createdAt?: string;
}

/**
 * Request para crear o actualizar una residencia.
 * Mapeado desde ResidenciaRequest.java
 *
 * Campos del backend:
 *  - idPropietario:  @NotNull — ID del residente propietario
 *  - codigoCasa:     @NotBlank, max 20 chars
 *  - cuotaMensual:   @NotNull, entre 0.01 y 500.00 (BigDecimal)
 *  - estado:         Opcional. EstadoResidencia enum: OCUPADA | DESOCUPADA.
 *                    Al crear, el backend asigna DESOCUPADA por defecto.
 *                    Al actualizar, si se envía, se persiste el nuevo estado.
 */
export interface ResidenciaRequest {
  codigoCasa: string;
  idPropietario: number;
  cuotaMensual: number;
  /** Opcional al crear; requerido para cambiar estado al editar */
  estado?: string;
}
