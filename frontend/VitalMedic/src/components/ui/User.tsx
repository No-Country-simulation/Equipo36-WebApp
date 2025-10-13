import { cn } from "clsx-for-tailwind";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import SingleButton from "./Buttons/SingleButton";

interface Props {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const User = ({ firstName, lastName, email }: Props) => {
  const [showPanel, setShowPanel] = useState(false);

  const navigate = useNavigate();
  const { keycloak } = useAuth();

  const handleButtonShowPanel = () => {
    setShowPanel(!showPanel);
  };

  const handleButtonLogout = async () => {
    try {
      navigate("/");
      await keycloak?.logout();
    } catch {
      console.error("Algo va mal");
    }
  };

  // Generar iniciales del usuario
  const getInitials = (first?: string, last?: string) => {
    const firstInitial = first?.charAt(0)?.toUpperCase() || "U";
    const lastInitial = last?.charAt(0)?.toUpperCase() || "S";
    return firstInitial + lastInitial;
  };

  const UserAvatar = ({ size = "w-6 h-6 md:w-8 md:h-8" }: { size?: string }) => (
    <div
      className={cn(
        size,
        "bg-gradient-to-br from-blue-500 to-purple-600",
        "rounded-full flex items-center justify-center",
        "text-white font-semibold",
        size.includes("w-6") || size.includes("w-8") ? "text-xs md:text-sm" : "text-lg md:text-xl"
      )}
    >
      {getInitials(firstName, lastName)}
    </div>
  );

  const componentPanel = (
    <div
      className={cn(
        "absolute top-12 md:top-14 right-0 z-50",
        "w-72 md:w-80 min-h-20 p-4 md:p-6",
        "bg-white rounded-xl border border-gray-200",
        "shadow-2xl",
        "flex flex-col items-center gap-3 md:gap-4",
      )}
    >
      <div className="text-center">
        <p className={cn("text-gray-500 text-xs md:text-sm mb-2")}>{email}</p>
        <UserAvatar size="w-12 h-12 md:w-16 md:h-16" />
        <h3 className={cn("text-base md:text-lg font-semibold mt-3 text-gray-900")}>
          {firstName} {lastName}
        </h3>
      </div>

      <div className="w-full border-t border-gray-100 pt-3 md:pt-4">
        <SingleButton variant="secondary" fullWidth onClick={handleButtonLogout}>
          Cerrar Sesión
        </SingleButton>
      </div>
    </div>
  );

  return (
    <div className={cn("relative")}>
      <button
        className={cn(
          "py-1.5 md:py-2 px-2 md:px-3",
          "rounded-xl border border-gray-200",
          "flex items-center gap-2 md:gap-3",
          "hover:shadow-md hover:border-gray-300 transition-all duration-200",
          "active:scale-95 bg-white",
          "max-w-[200px] md:max-w-none",
        )}
        type="button"
        onClick={handleButtonShowPanel}
      >
        <UserAvatar />
        <div className="text-left hidden sm:block">
          <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{firstName}</p>
          <p className="text-xs text-gray-500">Paciente</p>
        </div>
        <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {showPanel && componentPanel}
    </div>
  );
};

export default User;
