import { useEffect, useState } from "react";

interface TimeBlock {
  id: number;
  startTime: string;
  endTime: string;
  active: boolean;
}

interface WeeklySchedules {
  weekDay: string;
  timeBlocks: TimeBlock[];
}

type RespFetch = Promise<{
  success: boolean;
  message: string;
  data: {
    weeklySchedules: WeeklySchedules[];
  };
}>;

export default function useFetchFecha(doctorId: string) {
  const [fechas, setFechas] = useState<WeeklySchedules[] | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (doctorId === "") {
      setCargando(false);
      return;
    }

    fetch(
      `https://vitalmedic-backend.onrender.com/api/doctors/${doctorId}/schedules`,
    )
      .then((resp) => resp.json() as RespFetch)

      .then((datosJson) => {
        setFechas(datosJson.data.weeklySchedules);
      })

      .finally(() => {
        setCargando(false);
      });
  }, [doctorId]);

  return { fechas, cargando };
}
