import { cn } from "clsx-for-tailwind";
import Row from "./Row";

interface Props {
  rows: {
    especialidad: string;
    fechaHora: string;
    tipoDeCita: string;
    motivoAsunto: string;
    estado: string;
  }[];
}
const AppointmentTable = ({ rows }: Props) => {
  let idKey = 0;

  return (
    <table
      className={cn(
        "table-auto",
        "w-full bg-white",
        "shadow-xl inset-shadow-sm",
      )}
    >
      <thead className={cn("h-10 bg-blue-600", "text-white")}>
        <tr className={cn("[&>*]:text-start [&>*]:p-3")}>
          <th>Especialidad</th>
          <th>Fecha y Hora</th>
          <th>Tipo de cita</th>
          <th>Motivo / Asunto</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody className={cn("", "[&>*>td]:p-3")}>
        {rows.map((row) => (
          <Row
            key={`tabla-row-${idKey++}`}
            especialidad={row.especialidad}
            estado={row.estado}
            fechaHora={row.fechaHora}
            motivoAsunto={row.motivoAsunto}
            tipoDeCita={row.tipoDeCita}
          />
        ))}
      </tbody>
    </table>
  );
};

export default AppointmentTable;
