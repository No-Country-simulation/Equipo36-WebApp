import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import VideoCall from "../../components/ui/VideoCall";

// Mock data - después se reemplazará con datos del backend
const mockAppointment = {
  id: "001",
  doctor: "Dr. María González",
  patient: "José Osorio",
  especialidad: "Cardiología",
  fecha: "2025-10-13",
  hora: "14:30",
  motivo: "Consulta de seguimiento cardiovascular",
  meetLink: "https://meet.google.com/lookup/mock-001",
  status: "waiting" // waiting, active, completed
};

export default function SalaEspera() {
  const navigate = useNavigate();
  const [timeUntilStart, setTimeUntilStart] = useState<number>(0);
  const [appointment] = useState(mockAppointment);

  useEffect(() => {
    // Simulamos que la cita empieza en 5 minutos
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + 5);
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = startTime.getTime() - now.getTime();
      setTimeUntilStart(Math.max(0, Math.floor(diff / 1000)));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard/app/patient');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Sala de Espera Virtual
            </h1>
            <button
              onClick={handleBackToDashboard}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="font-semibold text-lg text-gray-900">
              Consulta con {appointment.doctor}
            </h2>
            <p className="text-gray-600">
              {appointment.especialidad} • {appointment.fecha} a las {appointment.hora}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Motivo: {appointment.motivo}
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center">
            {timeUntilStart > 0 ? (
              <>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatTime(timeUntilStart)}
                </div>
                <p className="text-gray-600">
                  para el inicio de la consulta
                </p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${Math.max(0, 100 - (timeUntilStart / 300 * 100))}%` 
                    }}
                  ></div>
                </div>
              </>
            ) : (
              <>
                <div className="text-green-600 text-4xl mb-2">✅</div>
                <p className="text-xl font-semibold text-green-700">
                  ¡La consulta está lista!
                </p>
                <p className="text-gray-600">
                  Puedes unirte cuando estés listo
                </p>
              </>
            )}
          </div>
        </div>

        {/* Video Call Component */}
        <div className="mb-6">
          <VideoCall
            appointmentId={appointment.id}
            meetLink={appointment.meetLink}
            isActive={timeUntilStart <= 0}
            userRole="patient"
            startTime={new Date()}
          />
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">
            Instrucciones para la consulta virtual
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Verifica tu conexión</p>
                <p className="text-sm text-gray-600">
                  Asegúrate de tener una buena conexión a internet y que tu cámara y micrófono funcionen correctamente.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Busca un lugar tranquilo</p>
                <p className="text-sm text-gray-600">
                  Elige un espacio privado y silencioso para la consulta.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ten tus documentos listos</p>
                <p className="text-sm text-gray-600">
                  Prepara tu documento de identidad y cualquier examen médico reciente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                ¿Problemas técnicos?
              </p>
              <p className="text-xs text-yellow-700">
                Contacta al soporte técnico: <span className="font-semibold">+56 9 1234 5678</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}