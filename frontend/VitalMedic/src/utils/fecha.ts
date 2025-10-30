type Day =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

const NAME_DAY: Record<Day, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

function formatearFecha(fecha: Date, diaASumar: number) {
  const fechaResultado = new Date(fecha);

  fechaResultado.setDate(fechaResultado.getDate() + diaASumar);

  const año = fechaResultado.getFullYear();
  const mes = String(fechaResultado.getMonth() + 1).padStart(2, "0");
  const diaActual = String(fechaResultado.getDate()).padStart(2, "0");

  return `${año}-${mes}-${diaActual}`;
}

export function diaAFecha(dia: string | null) {
  if (dia === null) {
    return "Algo va mal";
  }

  const fechaActual = new Date();
  const diaActualIndex = fechaActual.getDay();

  const diaBuscadoIndex = NAME_DAY[dia as Day];

  let diferenciaDia = diaBuscadoIndex - diaActualIndex;

  if (diferenciaDia < 0) {
    diferenciaDia += 7;
  }

  return formatearFecha(fechaActual, diferenciaDia);
}
