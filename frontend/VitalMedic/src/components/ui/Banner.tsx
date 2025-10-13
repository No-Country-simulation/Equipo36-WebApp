import { cn } from "clsx-for-tailwind";
import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}
const Banner = ({ title, children }: Props) => {
  return (
    <div
      className={cn(
        "h-28 md:h-36 px-4 md:px-5",
        "rounded-2xl shadow-2xl",
        "bg-[#1D4ED8]",
        "flex flex-col justify-center items-start gap-1",
      )}
    >
      <h2 className={cn("text-xl md:text-3xl font-bold text-white")}>{title}</h2>
      <p className={cn("text-white text-sm md:text-lg")}>{children}</p>
    </div>
  );
};

export default Banner;
