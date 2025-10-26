import { useEffect, useState } from "react";
import type { RespEspecialidad, T_Especialidad } from "../types/agregarCita";

const URL = "https://vitalmedic-backend.onrender.com/api/specialty";

export default function useFetchEspecialidades() {
  const [especialidades, setEspecialidades] = useState<T_Especialidad[] | null>(
    null,
  );
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(URL)
      .then((resp) => resp.json() as RespEspecialidad)
      .then((datosJson) => {
        setEspecialidades(datosJson.data);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  return { especialidades, cargando };
}
