import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "clsx-for-tailwind";
import { useAppSelector } from "../../hooks/reduxHooks";
import ConsultaCard from "../../components/ui/Card/ConsultaCard";
import { HistoryService, type PatientAppointmentItem } from "../../services/historyService";
import InfoSection from "../../components/ui/Card/InfoSection";

const HistorialMedico = () => {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [consultas, setConsultas] = useState<PatientAppointmentItem[]>([]);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'consultas' | 'medicamentos' | 'laboratorios'>('consultas');

  const userInitials = useMemo(() => {
    const first = userProfile?.firstName || (userProfile as any)?.username || "U";
    const last = userProfile?.lastName || "";
    const f = first.trim().charAt(0).toUpperCase();
    const l = last.trim().charAt(0).toUpperCase();
    return `${f}${l}`;
  }, [userProfile]);

  // Datos de ejemplo basados en el diseño de Figma
  const personalFields = [
    { label: "Fecha de Nacimiento:", value: "15/03/1979" },
    { label: "Grupo Sanguíneo:", value: "A+" },
    { label: "Alergias:", value: "Ninguna" },
    { label: "Condiciones:", value: "Hipertensión" }
  ];

  const emergenciaFields = [
    { label: "Nombre:", value: "Juan López" },
    { label: "Relación:", value: "Esposo" },
    { label: "Teléfono:", value: "+34 600 000 000" }
  ];

  // Cargar consultas reales de los últimos 30 días
  useEffect(() => {
    const load = async () => {
      if (!userProfile?.id) return;
      setLoading(true);
      try {
        const today = new Date();
        const days = 30;
        const tasks: Promise<PatientAppointmentItem[]>[] = [];
        for (let i = 0; i < days; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const iso = d.toISOString().slice(0, 10);
          tasks.push(HistoryService.getAppointmentsByDate(userProfile.id, iso));
        }
        const results = await Promise.all(tasks);
        const merged = results.flat();
        setConsultas(merged);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userProfile?.id]);

  const consultasRecientes = useMemo(() => {
    // Adaptar al formato esperado por ConsultaCard
    return consultas
      .map((c) => ({
        id: c.id,
        doctor: c.doctorName || "Doctor",
        fecha: new Date(c.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
        especialidad: c.specialty || "Medicina General",
        estado: (c.status || "COMPLETADO").toString().toUpperCase(),
        color: c.status === "ACTIVE" ? "green" : "blue",
        isVirtual: (c.type || "").toUpperCase() === "VIRTUAL",
        meetLink: undefined,
        startTime: undefined,
      }))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [consultas]);

  // Placeholders mientras no hay API (3 ítems c/u)
  const medicamentosMock = [
    { id: 'med-1', nombre: 'Losartán 50mg', fecha: '10 Oct 2024', estado: 'En uso' },
    { id: 'med-2', nombre: 'Metformina 850mg', fecha: '25 Sep 2024', estado: 'En uso' },
    { id: 'med-3', nombre: 'Ibuprofeno 400mg', fecha: '12 Sep 2024', estado: 'Ocasional' },
  ];

  const laboratoriosMock = [
    { id: 'lab-1', nombre: 'Hemograma Completo', fecha: '10 Oct 2024', resultado: 'Normal' },
    { id: 'lab-2', nombre: 'Perfil Lipídico', fecha: '15 Sep 2024', resultado: 'Normal' },
    { id: 'lab-3', nombre: 'Glucosa en ayunas', fecha: '15 Sep 2024', resultado: 'Normal' },
  ];

  const tabs = [
    { id: "personal", label: "Información Personal" },
    { id: "emergencia", label: "Contacto Emergencia" },
    { id: "consultas", label: "Consultas Recientes" }
  ];

  const handleViewConsultaDetails = (consultaId: string) => {
    const consulta = consultasRecientes.find(c => c.id === consultaId);
    
    if (consulta?.isVirtual && consulta.estado === "Activa") {
      // Si es una consulta virtual activa, ir a la sala de espera
      navigate(`/dashboard/app/patient/sala-espera/${consultaId}`);
    } else {
      // Para otras consultas, mostrar detalles (implementar después)
      // console.log("Ver detalles de consulta:", consultaId);
    }
  };

  const handleExportPDF = () => {
    // Función para exportar a PDF (implementar según necesidades)
    // console.log("Exportando historial médico a PDF...");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Encabezado mejorado */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold">
              {userInitials}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Historial Médico</h1>
              <p className="text-sm md:text-base text-gray-600 mt-0.5">
                {userProfile?.firstName || (userProfile as any)?.username || "Usuario"}{userProfile?.lastName ? ` ${userProfile.lastName}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm px-4 py-2 shadow hover:from-blue-700 hover:to-indigo-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Navegación por pestañas en móvil */}
      <div className="block lg:hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Layout responsive: Grid en desktop, tabs en móvil */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Información Personal */}
        <div className={cn(
          "lg:block",
          activeTab === "personal" ? "block" : "hidden lg:block"
        )}>
          <InfoSection
            title="Información Personal"
            fields={personalFields}
          />
        </div>

        {/* Contacto de Emergencia */}
        <div className={cn(
          "lg:block mt-4 lg:mt-0",
          activeTab === "emergencia" ? "block" : "hidden lg:block"
        )}>
          <InfoSection
            title="Contacto de Emergencia"
            fields={emergenciaFields}
          />
        </div>

        {/* Consultas Recientes */}
        <div className={cn(
          "lg:block mt-4 lg:mt-0",
          activeTab === "consultas" ? "block" : "hidden lg:block"
        )}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <button
                  className={cn(
                    "px-3 py-1 rounded-full text-sm border",
                    activeHistoryTab === 'consultas'
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  )}
                  onClick={() => setActiveHistoryTab('consultas')}
                >
                  Consultas
                </button>
                <button
                  className={cn(
                    "px-3 py-1 rounded-full text-sm border",
                    activeHistoryTab === 'medicamentos'
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  )}
                  onClick={() => setActiveHistoryTab('medicamentos')}
                >
                  Medicamentos
                </button>
                <button
                  className={cn(
                    "px-3 py-1 rounded-full text-sm border",
                    activeHistoryTab === 'laboratorios'
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  )}
                  onClick={() => setActiveHistoryTab('laboratorios')}
                >
                  Laboratorios
                </button>
              </div>
              {loading && <span className="text-xs text-gray-500">Cargando…</span>}
            </div>

            {activeHistoryTab === 'consultas' && (
              <div className="space-y-3 md:space-y-4">
                {consultasRecientes.map((consulta) => (
                  <ConsultaCard
                    key={consulta.id}
                    id={consulta.id}
                    doctor={consulta.doctor}
                    fecha={consulta.fecha}
                    especialidad={consulta.especialidad}
                    estado={consulta.estado}
                    isVirtual={consulta.isVirtual}
                    meetLink={consulta.meetLink}
                    startTime={consulta.startTime}
                    userRole="patient"
                    onViewDetails={() => handleViewConsultaDetails(consulta.id)}
                  />
                ))}
                {consultasRecientes.length === 0 && !loading && (
                  <p className="text-sm text-gray-500">No hay consultas en los últimos 30 días.</p>
                )}
              </div>
            )}

            {activeHistoryTab === 'medicamentos' && (
              <div className="space-y-3">
                {medicamentosMock.map((m) => (
                  <div key={m.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-7 7-4-4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{m.nombre}</p>
                        <p className="text-xs text-gray-500">{m.fecha}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                      {m.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeHistoryTab === 'laboratorios' && (
              <div className="space-y-3">
                {laboratoriosMock.map((l) => (
                  <div key={l.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{l.nombre}</p>
                        <p className="text-xs text-gray-500">{l.fecha}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                      {l.resultado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialMedico;