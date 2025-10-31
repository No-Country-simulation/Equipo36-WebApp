import React from 'react';
import { Calendar, Clock, User, Phone, MapPin } from 'lucide-react';
import { useNavigate } from "react-router";
import Banner from "../../components/ui/Banner";
import ActionCard from "../../components/ui/Card/ActionCard";
import SingleButton from "../../components/ui/Buttons/SingleButton";
import { useUserProfile } from "../../hooks/useUserProfile";
import { usePatientData } from "../../hooks/usePatientData";
import { usePatientAppointments } from "../../hooks/usePatientAppointments";

const Inicio = () => {
  console.log('🏠 Inicio: Componente renderizado');
  const { getProfileSummary, userProfile } = useUserProfile();
  const navigate = useNavigate();
  
  const profileSummary = getProfileSummary();
  
  const { 
    patientData, 
    loading: patientLoading, 
    fullName, 
    welcomeName, 
    age, 
    genderInSpanish, 
    email, 
    phone, 
    address, 
    birthDate,
    patientId 
  } = usePatientData();
  
  const { 
    nextAppointment, 
    appointments, 
    loading: appointmentsLoading 
  } = usePatientAppointments(patientId);
  
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
        title={`Bienvenido, ${welcomeName}`}
      >
        {fullName !== welcomeName
          ? `Hola ${fullName}, tu salud es nuestra prioridad`
          : `Hola ${welcomeName}, tu salud es nuestra prioridad`
        }
      </Banner>

      {/* Banner de Consulta Virtual Activa - pendiente de integración real */}

      {/* Grid de contenido principal - Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Columna principal - Próxima Cita */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Próxima Cita</h2>
            
            {appointmentsLoading ? (
              <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Cargando citas...</p>
              </div>
            ) : nextAppointment ? (
              <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {nextAppointment.doctorName}
                    </h3>
                    <p className="text-gray-600 mb-1">{nextAppointment.specialty}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(nextAppointment.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{nextAppointment.time}</span>
                      </div>
                    </div>
                    {nextAppointment.location && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{nextAppointment.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes citas programadas</h3>
                <p className="text-gray-600 mb-4">Agenda tu próxima cita médica</p>
                <SingleButton variant="primary" fullWidth onClick={handleAgendarCita}>
                  Agendar Nueva Cita
                </SingleButton>
              </div>
            )}
          </div>
        </div>

        {/* Columna lateral - Información del Usuario y Acciones Rápidas */}
        <div className="xl:col-span-1 space-y-4 md:space-y-6">
          {/* Información del Usuario */}
          {(patientData || (!patientLoading && (fullName || email))) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Mi Perfil</h2>
              
              {patientLoading ? (
                <div className="space-y-3">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nombre completo</p>
                      <p className="font-semibold text-gray-900">
                        {fullName}
                      </p>
                    </div>
                  </div>

                  {birthDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fecha de nacimiento</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(birthDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {age && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Edad</p>
                        <p className="font-semibold text-gray-900">
                          {age} años
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {genderInSpanish && genderInSpanish !== 'No especificado' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Género</p>
                        <p className="font-semibold text-gray-900">
                          {genderInSpanish}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {phone && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <p className="font-semibold text-gray-900">{phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {address && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dirección</p>
                        <p className="font-semibold text-gray-900">{address}</p>
                      </div>
                    </div>
                  )}
                  
                  {email && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{email}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
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