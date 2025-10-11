import { cn } from "clsx-for-tailwind";
import Banner from "../../components/ui/Banner";
import AppointmentCard from "../../components/ui/Card/AppointmentCard";
import { useAuth } from "../../hooks/useAuth";

const Inicio = () => {
  const { userProfile } = useAuth();

  return (
    <>
      <Banner
        title={`Bienvenido, ${userProfile?.firstName} ${userProfile?.lastName}`}
      >
        Tu salud es nuestra prioridad
      </Banner>
      <div
        className={cn(
          "min-h-56 mt-9 p-4",
          "rounded-2xl shadow-2xl",
          "bg-white",
        )}
      >
        <h2 className={cn("text-lg font-bold uppercase")}>Próximas citas</h2>

        <div className={cn("flex justify-start", "divide-x divide-[#E5E7EB]")}>
          <AppointmentCard />
        </div>
      </div>
    </>
  );
};

export default Inicio;
