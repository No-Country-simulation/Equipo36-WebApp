import { useEffect, useState } from "react";
import type { Doctor } from "../types/agregarCita";

const URL = "https://vitalmedic-backend.onrender.com/api/doctors";

export default function useFetchDoctores() {
  const [doctores, setDoctores] = useState<Doctor[] | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(URL)
      .then((resp) => resp.json() as Promise<Doctor[]>)

      .then((datosJson) => {
        setDoctores(datosJson);
      })

      .finally(() => {
        setCargando(false);
      });
  }, []);

  return { doctores, cargando };
}
