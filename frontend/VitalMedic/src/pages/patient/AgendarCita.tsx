import { cn } from "clsx-for-tailwind";
import { useState } from "react";
import SingleButton from "../../components/ui/Buttons/SingleButton";

const steps = [
  { id: 1, title: "Tipo", completed: true, active: true },
  { id: 2, title: "Especialidad", completed: false, active: false },
  { id: 3, title: "Médico", completed: false, active: false },
  { id: 4, title: "Fecha/Hora", completed: false, active: false },
];

const doctors = [
  {
    id: 1,
    name: "Dra. María González",
    specialty: "Cardiología",
    image: "/images/doctor-mg.svg",
  },
  {
    id: 2,
    name: "Dr. Carlos Mendoza",
    specialty: "Pediatría",
    image: "/images/doctor-cm.svg",
  },
  {
    id: 3,
    name: "Dra. Ana Martínez",
    specialty: "Dermatología",
    image: "/images/doctor-am.svg",
  },
  {
    id: 4,
    name: "Dr. Roberto Fernández",
    specialty: "Medicina General",
    image: "/images/doctor-rf.svg",
  },
];

const AgendarCita = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<"presencial" | "virtual" | null>(null);

  const handleBack = () => {
    window.history.back();
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">Agendar Nueva Cita</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                  step.active
                    ? "bg-blue-600 text-white"
                    : step.completed
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {step.id}
              </div>
              <span className="text-sm mt-2 text-gray-600">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-16 h-0.5 bg-gray-200 mx-4 mt-[-20px]" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-center mb-8">
              Selecciona el tipo de consulta
            </h2>
            
            <div className="flex justify-center gap-8 mb-8">
              <button
                onClick={() => setSelectedType("presencial")}
                className={cn(
                  "w-32 h-32 rounded-lg border-2 flex flex-col items-center justify-center gap-3 transition-all",
                  selectedType === "presencial"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <div className="w-8 h-8 bg-blue-600 rounded"></div>
                <span className="font-medium">Presencial</span>
              </button>
              
              <button
                onClick={() => setSelectedType("virtual")}
                className={cn(
                  "w-32 h-32 rounded-lg border-2 flex flex-col items-center justify-center gap-3 transition-all",
                  selectedType === "virtual"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <div className="w-8 h-8 bg-gray-600 rounded"></div>
                <span className="font-medium">Virtual</span>
              </button>
            </div>

            <div className="flex justify-center">
              <SingleButton
                onClick={handleContinue}
                disabled={!selectedType}
                variant="primary"
              >
                Continuar
              </SingleButton>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-center mb-8">
              Nuestros Médicos Profesionales
            </h2>
            
            <div className="grid grid-cols-2 gap-8">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full mb-4"
                  />
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.specialty}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <SingleButton onClick={handleContinue} variant="primary">
                Continuar
              </SingleButton>
            </div>
          </div>
        )}

        {(currentStep === 3 || currentStep === 4) && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-center mb-8">
              {currentStep === 3 ? "Selecciona un Médico" : "Selecciona Fecha y Hora"}
            </h2>
            <p className="text-center text-gray-600">
              Esta funcionalidad estará disponible próximamente
            </p>
            <div className="flex justify-center mt-8">
              <SingleButton onClick={() => {}} variant="primary">
                Continuar
              </SingleButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendarCita;