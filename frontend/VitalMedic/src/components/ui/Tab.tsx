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
        "w-full lg:w-full h-10 md:h-12 px-3 md:px-4 mx-1 md:mx-2 my-0.5 md:my-1 rounded-lg",
        "flex justify-start items-center gap-2 md:gap-3",
        "transition-all duration-200",
        "text-left text-sm md:text-base",
        "whitespace-nowrap lg:whitespace-normal",
        "min-w-fit lg:min-w-0",
        selected
          ? [
              "bg-blue-50 text-blue-700 font-semibold",
              "border-l-4 border-blue-600",
            ]
          : [
              "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              "hover:font-medium",
            ],
      )}
      type="button"
      onClick={() => {
        navigate(to);
      }}
    >
      <div
        className={cn(
          "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0",
          selected ? "bg-blue-600" : "bg-gray-400"
        )}
      ></div>
      <span className="truncate lg:truncate-none">{children}</span>
    </button>
  );
};

export default Tab;
