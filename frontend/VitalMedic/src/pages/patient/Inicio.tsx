import { useNavigate } from "react-router";
import Banner from "../../components/ui/Banner";
import ActionCard from "../../components/ui/Card/ActionCard";
import SingleButton from "../../components/ui/Buttons/SingleButton";
import ActiveCallBanner from "../../components/ui/ActiveCallBanner";
import { useUserProfile } from "../../hooks/useUserProfile";

const Inicio = () => {
  console.log('🏠 Inicio: Componente renderizado');
  const { getProfileSummary, userProfile } = useUserProfile();
  const navigate = useNavigate();
  
  const profileSummary = getProfileSummary();
  
  // Debug logs
  console.log('👤 Inicio: userProfile:', userProfile);
  console.log('📊 Inicio: profileSummary:', profileSummary);
  

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
        title={`Bienvenido, ${profileSummary.welcomeName}`}
      >
        {profileSummary.fullName !== profileSummary.welcomeName
          ? `Hola ${profileSummary.fullName}, tu salud es nuestra prioridad`
          : `Hola ${profileSummary.welcomeName}, tu salud es nuestra prioridad`
        }
      </Banner>

      {/* Banner de Consulta Virtual Activa - pendiente de integración real */}

      {/* Grid de contenido principal - Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Columna principal - Próxima Cita */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Próxima Cita</h2>
            
            {
              <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes citas programadas</h3>
                <p className="text-gray-600 mb-4">Agenda tu próxima cita médica</p>
                <SingleButton variant="primary" fullWidth onClick={handleAgendarCita}>
                  Agendar Nueva Cita
              </SingleButton>
            </div>
            }
          </div>
        </div>

        {/* Columna lateral - Información del Usuario y Acciones Rápidas */}
        <div className="xl:col-span-1 space-y-4 md:space-y-6">
          {/* Información del Usuario */}
          {profileSummary.isComplete && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Mi Perfil</h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nombre completo</p>
                    <p className="font-semibold text-gray-900">
                      {profileSummary.fullName}
                    </p>
          </div>
        </div>

                {profileSummary.birthDate && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha de nacimiento</p>
                      <p className="font-semibold text-gray-900">
                        {profileSummary.birthDate}
                      </p>
                    </div>
                  </div>
                )}
                
                {profileSummary.age && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Edad</p>
                      <p className="font-semibold text-gray-900">
                        {profileSummary.age} años
                      </p>
                    </div>
                  </div>
                )}
                
                {profileSummary.gender && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Género</p>
                      <p className="font-semibold text-gray-900">
                        {profileSummary.gender}
                      </p>
                    </div>
                  </div>
                )}
                
                {profileSummary.phone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-semibold text-gray-900">{profileSummary.phone}</p>
                    </div>
                  </div>
                )}
                
                {profileSummary.address && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-semibold text-gray-900">{profileSummary.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Acciones Rápidas */}
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