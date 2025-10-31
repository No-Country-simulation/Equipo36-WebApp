import { useState } from "react";
import { cn } from "clsx-for-tailwind";
import { useAppSelector } from "../../hooks/reduxHooks";
import SingleButton from "../../components/ui/Buttons/SingleButton";
import FormField, { FormSection } from "../../components/ui/Form/FormField";

interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
}

interface MedicalData {
  bloodType: string;
  allergies: string;
  conditions: string;
  medications: string;
  insurance: string;
  insuranceNumber: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface AppPreferences {
  notifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  language: string;
  theme: string;
}

const Configuracion = () => {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Estados para los formularios
  const [personalData, setPersonalData] = useState<PersonalData>({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    dateOfBirth: userProfile?.birthDate || "",
    gender: userProfile?.gender?.toLowerCase() || "",
    address: userProfile?.address || "",
    city: "Madrid" // Por defecto, se puede expandir después
  });

  const [medicalData, setMedicalData] = useState<MedicalData>({
    bloodType: "A+",
    allergies: "Ninguna",
    conditions: "Hipertensión",
    medications: "Lisinopril 10mg",
    insurance: "Seguro Nacional de Salud",
    insuranceNumber: "123456789"
  });

  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: "Juan López",
    relationship: "Esposo",
    phone: "+34 600 000 000",
    email: "juan.lopez@email.com"
  });

  const [preferences, setPreferences] = useState<AppPreferences>({
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,
    language: "es",
    theme: "light"
  });

  const tabs = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "medical", label: "Médico", icon: "🏥" },
    { id: "emergency", label: "Emergencia", icon: "🚨" },
    { id: "preferences", label: "Preferencias", icon: "⚙️" }
  ];

  const bloodTypeOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" }
  ];

  const genderOptions = [
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
    { value: "otro", label: "Otro" },
    { value: "prefiero-no-decir", label: "Prefiero no decir" }
  ];

  const relationshipOptions = [
    { value: "esposo", label: "Esposo/a" },
    { value: "padre", label: "Padre" },
    { value: "madre", label: "Madre" },
    { value: "hijo", label: "Hijo/a" },
    { value: "hermano", label: "Hermano/a" },
    { value: "amigo", label: "Amigo/a" },
    { value: "otro", label: "Otro" }
  ];

  const languageOptions = [
    { value: "es", label: "Español" },
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "pt", label: "Português" }
  ];

  const themeOptions = [
    { value: "light", label: "Claro" },
    { value: "dark", label: "Oscuro" },
    { value: "system", label: "Sistema" }
  ];

  const handleSaveSection = async (section: string) => {
    setIsLoading(true);
    setSuccessMessage("");
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage(`✅ ${section === 'personal' ? 'Información personal' : 
                              section === 'medical' ? 'Información médica' :
                              section === 'emergency' ? 'Contacto de emergencia' :
                              'Preferencias'} guardada correctamente`);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          Configuración
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Gestiona tu información personal y preferencias de la aplicación
        </p>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm md:text-base">{successMessage}</p>
        </div>
      )}

      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2 md:space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap py-3 px-2 md:px-4 border-b-2 font-medium text-sm md:text-base transition-colors",
                "flex items-center space-x-2",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <span className="text-base md:text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div className="space-y-6">
        {/* Información Personal */}
        {activeTab === "personal" && (
          <FormSection title="Información Personal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FormField
                label="Nombre"
                name="firstName"
                value={personalData.firstName}
                onChange={(value) => setPersonalData(prev => ({ ...prev, firstName: value }))}
                required
                placeholder="Ingresa tu nombre"
              />
              <FormField
                label="Apellido"
                name="lastName"
                value={personalData.lastName}
                onChange={(value) => setPersonalData(prev => ({ ...prev, lastName: value }))}
                required
                placeholder="Ingresa tu apellido"
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={personalData.email}
                onChange={(value) => setPersonalData(prev => ({ ...prev, email: value }))}
                required
                placeholder="tu@email.com"
              />
              <FormField
                label="Teléfono"
                name="phone"
                type="tel"
                value={personalData.phone}
                onChange={(value) => setPersonalData(prev => ({ ...prev, phone: value }))}
                required
                placeholder="+34 600 000 000"
              />
              <FormField
                label="Fecha de Nacimiento"
                name="dateOfBirth"
                type="date"
                value={personalData.dateOfBirth}
                onChange={(value) => setPersonalData(prev => ({ ...prev, dateOfBirth: value }))}
                required
              />
              <FormField
                label="Género"
                name="gender"
                type="select"
                value={personalData.gender}
                onChange={(value) => setPersonalData(prev => ({ ...prev, gender: value }))}
                options={genderOptions}
                placeholder="Selecciona tu género"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FormField
                label="Dirección"
                name="address"
                value={personalData.address}
                onChange={(value) => setPersonalData(prev => ({ ...prev, address: value }))}
                placeholder="Tu dirección completa"
              />
              <FormField
                label="Ciudad"
                name="city"
                value={personalData.city}
                onChange={(value) => setPersonalData(prev => ({ ...prev, city: value }))}
                placeholder="Tu ciudad"
              />
            </div>
            <div className="flex justify-end">
              <SingleButton
                variant="primary"
                onClick={() => handleSaveSection("personal")}
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar Información Personal"}
              </SingleButton>
            </div>
          </FormSection>
        )}

        {/* Información Médica */}
        {activeTab === "medical" && (
          <FormSection title="Información Médica">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FormField
                label="Grupo Sanguíneo"
                name="bloodType"
                type="select"
                value={medicalData.bloodType}
                onChange={(value) => setMedicalData(prev => ({ ...prev, bloodType: value }))}
                options={bloodTypeOptions}
                required
                placeholder="Selecciona tu grupo sanguíneo"
              />
              <FormField
                label="Seguro Médico"
                name="insurance"
                value={medicalData.insurance}
                onChange={(value) => setMedicalData(prev => ({ ...prev, insurance: value }))}
                placeholder="Nombre de tu seguro médico"
              />
              <FormField
                label="Número de Seguro"
                name="insuranceNumber"
                value={medicalData.insuranceNumber}
                onChange={(value) => setMedicalData(prev => ({ ...prev, insuranceNumber: value }))}
                placeholder="Número de póliza"
              />
            </div>
            <div className="space-y-4 md:space-y-6">
              <FormField
                label="Alergias"
                name="allergies"
                value={medicalData.allergies}
                onChange={(value) => setMedicalData(prev => ({ ...prev, allergies: value }))}
                placeholder="Describe tus alergias (medicamentos, alimentos, etc.)"
              />
              <FormField
                label="Condiciones Médicas"
                name="conditions"
                value={medicalData.conditions}
                onChange={(value) => setMedicalData(prev => ({ ...prev, conditions: value }))}
                placeholder="Condiciones médicas actuales"
              />
              <FormField
                label="Medicamentos Actuales"
                name="medications"
                value={medicalData.medications}
                onChange={(value) => setMedicalData(prev => ({ ...prev, medications: value }))}
                placeholder="Medicamentos que tomas actualmente"
              />
            </div>
            <div className="flex justify-end">
              <SingleButton
                variant="primary"
                onClick={() => handleSaveSection("medical")}
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar Información Médica"}
              </SingleButton>
            </div>
          </FormSection>
        )}

        {/* Contacto de Emergencia */}
        {activeTab === "emergency" && (
          <FormSection title="Contacto de Emergencia">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FormField
                label="Nombre Completo"
                name="emergencyName"
                value={emergencyContact.name}
                onChange={(value) => setEmergencyContact(prev => ({ ...prev, name: value }))}
                required
                placeholder="Nombre del contacto de emergencia"
              />
              <FormField
                label="Relación"
                name="relationship"
                type="select"
                value={emergencyContact.relationship}
                onChange={(value) => setEmergencyContact(prev => ({ ...prev, relationship: value }))}
                options={relationshipOptions}
                required
                placeholder="Selecciona la relación"
              />
              <FormField
                label="Teléfono"
                name="emergencyPhone"
                type="tel"
                value={emergencyContact.phone}
                onChange={(value) => setEmergencyContact(prev => ({ ...prev, phone: value }))}
                required
                placeholder="+34 600 000 000"
              />
              <FormField
                label="Email (Opcional)"
                name="emergencyEmail"
                type="email"
                value={emergencyContact.email}
                onChange={(value) => setEmergencyContact(prev => ({ ...prev, email: value }))}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Información importante</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Este contacto será notificado en caso de emergencia médica. Asegúrate de que la información esté actualizada.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <SingleButton
                variant="primary"
                onClick={() => handleSaveSection("emergency")}
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar Contacto de Emergencia"}
              </SingleButton>
            </div>
          </FormSection>
        )}

        {/* Preferencias */}
        {activeTab === "preferences" && (
          <FormSection title="Preferencias de la Aplicación">
            <div className="space-y-6">
              {/* Notificaciones */}
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-medium text-gray-900">Notificaciones</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm md:text-base text-gray-700">Activar notificaciones push</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm md:text-base text-gray-700">Notificaciones por email</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={(e) => setPreferences(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm md:text-base text-gray-700">Notificaciones por SMS</span>
                  </label>
                </div>
              </div>

              {/* Idioma y Tema */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <FormField
                  label="Idioma"
                  name="language"
                  type="select"
                  value={preferences.language}
                  onChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                  options={languageOptions}
                  placeholder="Selecciona idioma"
                />
                <FormField
                  label="Tema"
                  name="theme"
                  type="select"
                  value={preferences.theme}
                  onChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}
                  options={themeOptions}
                  placeholder="Selecciona tema"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <SingleButton
                variant="primary"
                onClick={() => handleSaveSection("preferences")}
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar Preferencias"}
              </SingleButton>
            </div>
          </FormSection>
        )}
      </div>
    </div>
  );
};

export default Configuracion;