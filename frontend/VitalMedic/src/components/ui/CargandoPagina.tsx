import { cn } from "clsx-for-tailwind";

const CargandoPagina = () => {
  return (
    <div
      className={cn(
        "w-screen h-screen",
        "flex justify-center items-center gap-2",
      )}
    >
      <h4 className={cn("text-4xl text-gray-400 font-bold", "animate-bounce")}>
        Cargando...
      </h4>
    </div>
  );
};

export default CargandoPagina;
