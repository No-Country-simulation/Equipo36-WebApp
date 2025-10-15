import { cn } from "clsx-for-tailwind";
import { useMobileNavigation } from "../../hooks/useMobileNavigation";

interface Tab {
  title: string;
  path: string;
}

interface Props {
  tabs: Tab[];
}

const MobileBottomNavigation = ({ tabs }: Props) => {
  const { handleNavigation, isActive } = useMobileNavigation();

  const icons = [
    // Inicio
    (isActive: boolean) => (
      <svg className="w-5 h-5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    // Mis Citas
    (isActive: boolean) => (
      <svg className="w-5 h-5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    // Médicos
    (isActive: boolean) => (
      <svg className="w-5 h-5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    // Historial
    (isActive: boolean) => (
      <svg className="w-5 h-5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.slice(0, 4).map((tab, index) => {
          const active = isActive(tab.path);
          
          return (
            <button
              key={tab.path}
              onClick={() => handleNavigation(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
                "min-w-[70px] max-w-[80px]",
                active 
                  ? "text-blue-600 bg-blue-50 scale-105" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              {icons[index]?.(active)}
              <span className={cn(
                "text-xs mt-1 font-medium truncate w-full text-center",
                active ? "text-blue-600" : "text-gray-500"
              )}>
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNavigation;