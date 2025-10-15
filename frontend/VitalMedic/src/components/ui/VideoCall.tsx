import { cn } from "clsx-for-tailwind";

interface VideoCallProps {
  appointmentId: string;
  meetLink?: string;
  isActive: boolean;
  userRole: 'patient' | 'doctor';
  startTime?: Date;
  className?: string;
}

export default function VideoCall({ 
  appointmentId, 
  meetLink, 
  isActive, 
  userRole, 
  startTime,
  className 
}: VideoCallProps) {
  const handleJoinCall = () => {
    if (meetLink) {
      // Por ahora abrimos un enlace de Google Meet mock
      // Después se reemplazará con el enlace real del backend
      window.open(meetLink || `https://meet.google.com/lookup/${appointmentId}`, '_blank');
    } else {
      // Mock para desarrollo - genera un enlace temporal
      const mockMeetLink = `https://meet.google.com/lookup/mock-${appointmentId}`;
      window.open(mockMeetLink, '_blank');
    }
  };

  const getCallStatus = (): { text: string; color: 'gray' | 'yellow' | 'green' | 'red' } => {
    if (!startTime) return { text: 'Consulta programada', color: 'gray' };
    
    const now = new Date();
    const start = new Date(startTime);
    const timeDiff = start.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff > 15) {
      return { text: 'Consulta programada', color: 'gray' };
    } else if (minutesDiff > 0 && minutesDiff <= 15) {
      return { text: `Inicia en ${minutesDiff} min`, color: 'yellow' };
    } else if (minutesDiff >= -5) {
      return { text: 'Consulta activa', color: 'green' };
    } else {
      return { text: 'Consulta finalizada', color: 'red' };
    }
  };

  const { text: statusText, color: statusColor } = getCallStatus();
  const canJoin = isActive || (startTime && new Date(startTime).getTime() - new Date().getTime() <= 15 * 60 * 1000);

  const statusColors = {
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-700'
  };

  const buttonColors = {
    gray: 'bg-gray-400 cursor-not-allowed',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-gray-400 cursor-not-allowed'
  };

  return (
    <div className={cn(
      "border rounded-lg p-4 transition-all duration-200",
      statusColors[statusColor],
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {statusColor === 'green' ? (
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            ) : statusColor === 'yellow' ? (
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            ) : (
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            )}
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">
              📹 Consulta Virtual
            </h4>
            <p className="text-xs opacity-80">
              {statusText}
            </p>
          </div>
        </div>

        {canJoin ? (
          <button
            onClick={handleJoinCall}
            className={cn(
              "px-3 py-1.5 text-white text-xs font-medium rounded-md transition-colors",
              buttonColors[statusColor]
            )}
          >
            {statusColor === 'green' ? '🎥 Unirse' : '⏰ Prepararse'}
          </button>
        ) : (
          <span className="text-xs opacity-60">
            {userRole === 'doctor' ? 'Esperando hora' : 'No disponible'}
          </span>
        )}
      </div>
      
      {startTime && (
        <div className="mt-2 text-xs opacity-70">
          Horario: {new Date(startTime).toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      )}
    </div>
  );
}