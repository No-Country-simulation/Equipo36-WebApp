import { cn } from "clsx-for-tailwind";
import { useNavigate } from "react-router";

interface ActiveCallBannerProps {
  appointmentId: string;
  doctorName: string;
  timeRemaining: string;
  className?: string;
}

export default function ActiveCallBanner({ 
  appointmentId, 
  doctorName, 
  timeRemaining,
  className 
}: ActiveCallBannerProps) {
  const navigate = useNavigate();

  const handleJoinCall = () => {
    navigate(`/dashboard/patient/sala-espera/${appointmentId}`);
  };

  return (
    <div className={cn(
      "bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white",
      "shadow-lg border border-green-400",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-semibold text-lg">
              Consulta Virtual Activa
            </h3>
            <p className="text-green-100 text-sm">
              Con {doctorName} • Inicia en {timeRemaining}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleJoinCall}
          className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Unirse</span>
        </button>
      </div>
    </div>
  );
}