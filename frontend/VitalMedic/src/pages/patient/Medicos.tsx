import { useEffect, useState } from "react";
import useFetchDoctores from "../../hooks/useFetchDoctores";
import { DoctorService } from "../../services/doctorService";
import SingleButton from "../../components/ui/Buttons/SingleButton";

interface FechaItemProps {
  date: string;
}

const FechaItem = ({ date }: FechaItemProps) => {
  return (
    <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800">
      {new Date(date).toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
  );
};

const Medicos = () => {
  const { doctores, cargando } = useFetchDoctores();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      if (!selectedDoctorId) return;
      setLoadingDates(true);
      const dates = await DoctorService.getAvailableDates(selectedDoctorId, 30);
      setAvailableDates(dates);
      setLoadingDates(false);
    };
    fetchDates();
  }, [selectedDoctorId]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">Médicos</h1>
        <p className="text-gray-600 text-sm mt-1">Consulta el listado de médicos y sus fechas disponibles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Listado de médicos</h2>

          {cargando ? (
            <p className="text-gray-500 text-sm">Cargando médicos…</p>
          ) : !doctores || doctores.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay médicos disponibles</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctores.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Dr(a). {doc.firstName} {doc.lastName}</p>
                      <p className="text-sm text-gray-600">{doc.specialty}</p>
                      {doc.licenseNumber && (
                        <p className="text-xs text-gray-500 mt-1">Céd. {doc.licenseNumber}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <SingleButton
                      variant="secondary"
                      onClick={() => setSelectedDoctorId(doc.id)}
                      fullWidth
                    >
                      Ver fechas disponibles
                    </SingleButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Fechas disponibles</h2>
          {!selectedDoctorId ? (
            <p className="text-gray-500 text-sm">Selecciona un médico para ver sus fechas.</p>
          ) : loadingDates ? (
            <p className="text-gray-500 text-sm">Cargando fechas…</p>
          ) : availableDates.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay fechas disponibles.</p>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {availableDates.map((d, idx) => (
                <FechaItem key={`${d}-${idx}`} date={d} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medicos;


