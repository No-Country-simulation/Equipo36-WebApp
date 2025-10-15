import { useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "clsx-for-tailwind";
import { useAppSelector } from "../../hooks/reduxHooks";
import SingleButton from "../../components/ui/Buttons/SingleButton";
import ConsultaCard from "../../components/ui/Card/ConsultaCard";
import InfoSection from "../../components/ui/Card/InfoSection";

const HistorialMedico = () => {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

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

  const consultasRecientes = [
    {
      id: "CG1",
      doctor: "Dr. Carlos García",
      fecha: "15 Oct 2024",
      especialidad: "Medicina General",
      estado: "COMPLETADO",
      color: "blue",
      isVirtual: false
    },
    {
      id: "LM1", 
      doctor: "Dra. Laura Martínez",
      fecha: "20 Jun 2024",
      especialidad: "Cardiología",
      estado: "COMPLETADO",
      color: "blue",
      isVirtual: true,
      meetLink: "https://meet.google.com/lookup/lm1-cardio",
      startTime: new Date("2024-06-20T14:30:00")
    },
    {
      id: "VM1",
      doctor: "Dr. Roberto Silva",
      fecha: "13 Oct 2025",
      especialidad: "Medicina General",
      estado: "Activa",
      color: "green",
      isVirtual: true,
      meetLink: "https://meet.google.com/lookup/vm1-general",
      startTime: new Date("2025-10-13T15:00:00")
    },
    {
      id: "CG2",
      doctor: "Dr. Carlos García", 
      fecha: "15 Mar 2024",
      especialidad: "Medicina General",
      estado: "COMPLETADO",
      color: "blue",
      isVirtual: false
    }
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
      navigate(`/dashboard/patient/sala-espera/${consultaId}`);
    } else {
      // Para otras consultas, mostrar detalles (implementar después)
      console.log("Ver detalles de consulta:", consultaId);
    }
  };

  const handleExportPDF = () => {
    // Función para exportar a PDF (implementar según necesidades)
    console.log("Exportando historial médico a PDF...");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header con título y botón exportar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            Historial Médico
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {userProfile?.firstName || "María"} López - 45 años
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <SingleButton
            variant="secondary"
            onClick={handleExportPDF}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar PDF
          </SingleButton>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
              Consultas Recientes
            </h2>
            
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialMedico;