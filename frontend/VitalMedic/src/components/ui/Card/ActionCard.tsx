import { cn } from "clsx-for-tailwind";
import type { ReactNode } from "react";

interface Props {
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const ActionCard = ({ title, icon, onClick, className }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center",
        "w-full h-32 p-4",
        "bg-white rounded-xl shadow-sm border border-gray-100",
        "hover:shadow-md hover:border-gray-200 transition-all duration-200",
        "hover:scale-105",
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 mb-3 flex items-center justify-center">
          {icon}
        </div>
      )}
      <span className="text-sm font-medium text-gray-700 text-center">
        {title}
      </span>
    </button>
  );
};

export default ActionCard;