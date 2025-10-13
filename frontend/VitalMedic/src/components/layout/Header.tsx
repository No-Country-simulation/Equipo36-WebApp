import { cn } from "clsx-for-tailwind";
import { useAuth } from "../../hooks/useAuth";
import User from "../ui/User";

const Header = () => {
  const { userProfile } = useAuth();

  return (
    <header
      className={cn(
        "h-16 px-4 md:px-6 lg:px-10",
        "flex justify-between items-center",
        "bg-white",
        "border-b border-[#E5E7EB]",
      )}
    >
      <div className="flex items-center gap-3 md:gap-4">
      <img 
        src="/vital-logo.svg" 
        alt="VitalMedic" 
          className="h-12 md:h-23 lg:h-32 w-auto transition-all duration-300 hover:scale-105"
           />
        <span className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600 hidden sm:block">
          VitalMedic
        </span>
      </div>
      <User
        firstName={userProfile?.firstName}
        lastName={userProfile?.lastName}
        email={userProfile?.email}
      />
    </header>
  );
};

export default Header;