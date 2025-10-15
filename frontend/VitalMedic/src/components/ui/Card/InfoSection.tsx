import { cn } from "clsx-for-tailwind";

interface InfoField {
  label: string;
  value: string;
}

interface InfoSectionProps {
  title: string;
  fields: InfoField[];
  className?: string;
}

const InfoSection = ({ title, fields, className }: InfoSectionProps) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6",
      className
    )}>
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
        {title}
      </h2>
      
      <div className="space-y-4 md:space-y-6">
        {fields.length <= 2 ? (
          // Para 2 o menos campos, usar grid de 2 columnas en pantallas pequeñas
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {field.label}
                </label>
                <p className="text-sm md:text-base font-semibold text-gray-900">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          // Para más de 2 campos, apilarlos verticalmente
          fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {field.label}
              </label>
              <p className="text-sm md:text-base font-semibold text-gray-900">
                {field.value}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InfoSection;