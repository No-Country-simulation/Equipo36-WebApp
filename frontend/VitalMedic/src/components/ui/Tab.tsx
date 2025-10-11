import { cn } from "clsx-for-tailwind";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

interface Props {
  children: ReactNode;
  selected?: boolean;
  to: string;
}
const Tab = ({ children, selected = false, to }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      className={cn(
        "w-[240px] h-12 pl-6",
        "flex justify-start items-center gap-3",
        "transition-all",
        selected
          ? [
              "border-r-4 border-[#2563EB]",
              "text-[#2563EB] font-semibold",
              "bg-[#EFF6FF]",
            ]
          : ["hover:font-bold"],
      )}
      type="button"
      onClick={() => {
        navigate(to);
      }}
    >
      <div
        className={cn("w-5 h-5", "rounded-sm", selected && ["bg-[#2563EB]"])}
      ></div>
      {children}
    </button>
  );
};

export default Tab;
