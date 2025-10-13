import { useNavigate } from "react-router";
import Banner from "../../components/ui/Banner";
import ActionCard from "../../components/ui/Card/ActionCard";
import SingleButton from "../../components/ui/Buttons/SingleButton";
import { useAuth } from "../../hooks/useAuth";

const Inicio = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const handleAgendarCita = () => {
    navigate("/dashboard/patient/agendar-cita");
  };

  const handleVerHistorial = () => {
    navigate("/dashboard/patient/historial");
  };

  const handleMedicosDisponibles = () => {
    navigate("/dashboard/patient/medicos");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Banner de Bienvenida */}
      <Banner
        title={`Bienvenida, ${userProfile?.firstName || "María"}`}
      >
        Tu salud es nuestra prioridad
      </Banner>

      {/* Grid de contenido principal - Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Columna principal - Próxima Cita */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Próxima Cita</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Dr. Carlos García</h3>
                    <p className="text-gray-600 text-xs md:text-sm">Medicina General</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 self-start">
                  Virtual
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Fecha</p>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">15 Octubre 2024</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Hora</p>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">10:30 AM - 11:00 AM</p>
                </div>
              </div>
              
              <SingleButton variant="primary" fullWidth onClick={() => {}}>
                Unirse a Consulta
              </SingleButton>
            </div>
          </div>
        </div>

        {/* Columna lateral - Acciones Rápidas */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Acciones Rápidas</h2>
            
            {/* Grid responsive para acciones rápidas */}
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-3 md:gap-4">
              <ActionCard
                title="Agendar Nueva Cita"
                icon={
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                }
                onClick={handleAgendarCita}
                className="h-16 md:h-20 xl:h-24"
              />
              
              <ActionCard
                title="Ver Historial Médico"
                icon={
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                }
                onClick={handleVerHistorial}
                className="h-16 md:h-20 xl:h-24"
              />
              
              <ActionCard
                title="Médicos Disponibles"
                icon={
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                }
                onClick={handleMedicosDisponibles}
                className="h-16 md:h-20 xl:h-24"
              />

              <ActionCard
                title="Mis Citas"
                icon={
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                }
                onClick={() => navigate("/dashboard/patient/mis-citas")}
                className="h-16 md:h-20 xl:h-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;