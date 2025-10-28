import { useEffect, useState } from "react";

interface Fecha {
  date: string;
  status: string;
}
interface Respuesta {
  success: boolean;
  message: string;
  data: Fecha[];
}

type RespFecha = Promise<Respuesta>;

export default function useFetchFecha(doctorId: string) {
  const URL = `https://vitalmedic-backend.onrender.com/api/doctors/${doctorId}/available-dates`;

  const [fechas, setFechas] = useState<Fecha[] | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (doctorId === "") {
      setCargando(false);
      return;
    }

    fetch(URL)
      .then((resp) => resp.json() as RespFecha)

      .then((datosJson) => {
        setFechas(datosJson.data);
      })

      .finally(() => {
        setCargando(false);
      });
  }, [URL, doctorId]);

  return { fechas, cargando };
}
