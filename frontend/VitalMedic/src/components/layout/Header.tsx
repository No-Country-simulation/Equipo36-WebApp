import { cn } from "clsx-for-tailwind";
import { useAuth } from "../../hooks/useAuth";
import User from "../ui/User";

const Header = () => {
  const { userProfile } = useAuth();

  return (
    <header
      className={cn(
        "h-16 px-10",
        "flex justify-between items-center",
        "bg-white",
        "border-b border-[#E5E7EB]",
      )}
    >
      <h1 className={cn("text-2xl font-bold")}>VitalMedic</h1>
      <User
        firstName={userProfile?.firstName}
        lastName={userProfile?.lastName}
        email={userProfile?.email}
      />
    </header>
  );
};

export default Header;
