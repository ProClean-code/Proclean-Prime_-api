export class ReservationDataDto {
  nombre!: string;
  apellido!: string;
  correo!: string;
  celular!: string;
  barrio!: string;
  direccion!: string;
  llegada!: string | null;
  apartamento!: string | null;
  tipoDocumento!: string;
  numeroDocumento!: string;
  referido!: string | null;
  planServicio!: string;
  requerimientos!: string | null;
  fechas!: string[];
  hora!: string;
}
