import { cn } from "clsx-for-tailwind";
import VideoCall from "../VideoCall";

interface ConsultaCardProps {
  id: string;
  doctor: string;
  fecha: string;
  especialidad: string;
  estado: string;
  isVirtual?: boolean;
  meetLink?: string;
  startTime?: Date;
  userRole?: 'patient' | 'doctor';
  onViewDetails?: () => void;
}

const ConsultaCard = ({ 
  id, 
  doctor, 
  fecha, 
  especialidad, 
  estado, 
  isVirtual = false,
  meetLink,
  startTime,
  userRole = 'patient',
  onViewDetails 
}: ConsultaCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xs md:text-sm font-semibold text-blue-600">
              {id}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm md:text-base truncate">
              {doctor}
            </p>
            <p className="text-xs md:text-sm text-gray-600">
              {fecha} - {especialidad}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
          {estado}
        </span>
      </div>
      
      {/* VideoCall component para consultas virtuales */}
      {isVirtual && (
        <div className="mt-3">
          <VideoCall
            appointmentId={id}
            meetLink={meetLink}
            isActive={estado === 'Activa'}
            userRole={userRole}
            startTime={startTime}
            className="text-xs"
          />
        </div>
      )}
      
      {onViewDetails && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={onViewDetails}
            className={cn(
              "text-sm text-blue-600 hover:text-blue-700 font-medium",
              "flex items-center space-x-1 transition-colors"
            )}
          >
            <span>Ver detalles</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultaCard;