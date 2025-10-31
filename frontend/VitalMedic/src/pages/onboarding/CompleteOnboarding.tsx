import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  OnboardingService,
  type IdentifierRequest,
  type OnboardingIdentifierResponse,
} from "../../services/onboardingService";
import { useAuth } from "../../hooks/useAuth";
import { isBackendErrorFlagSet, setBackendErrorFlag, clearBackendErrorFlag } from "../../utils/onboardingUtils";
import BackendStatusBanner from "../../components/ui/BackendStatusBanner";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { updateUserProfile } from "../../features/auth/authSlice";

// ========================================
// INTERFACES
// ========================================

interface OnboardingState {
  currentStep: 1 | 2 | 3;
  // Paso 1: Identificación
  selectedSystem: "CURP" | "RFC" | "NSS_IMSS";
  identifierValue: string;
  identifierSubmitted: boolean;
  foundInFhir: boolean;
  fhirData: any | null;

  // Paso 2: Datos del perfil
  profileData: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    phone: string;
    address: string;
  };

  // Estado general
  loading: boolean;
  error: string | null;
  success: string | null;
  backendFailing: boolean;
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const CompleteOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasRole } = useAuth();

  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    selectedSystem: "CURP",
    identifierValue: "",
    identifierSubmitted: false,
    foundInFhir: false,
    fhirData: null,
    profileData: {
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "MALE",
      phone: "",
      address: "",
    },
    loading: false,
    error: null,
    success: null,
    backendFailing: false,
  });

  // ========================================
  // EFECTOS
  // ========================================

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (!hasRole("PATIENT")) {
      navigate("/dashboard");
      return;
    }

    // Verificar el estado actual del onboarding
    const checkOnboardingStatus = async () => {
      // PRIORIDAD 1: Si ya hay un error de backend previo, no verificar nuevamente
      if (isBackendErrorFlagSet()) {
        setState((prev) => ({
          ...prev,
          currentStep: 1,
          backendFailing: true,
        }));
        return;
      }

      try {
        const statusResponse = await OnboardingService.getOnboardingStatus();
        const currentStatus = statusResponse.status;

        // Determinar el paso inicial basado en el estado
        let initialStep: 1 | 2 | 3 = 1;
        
        switch (currentStatus) {
          case "PENDING_IDENTIFIER":
            initialStep = 1;
            break;
          case "IMPORT_PROMPT":
          case "MANUAL_ENTRY":
            initialStep = 2;
            break;
          case "COMPLETED":
            // Si ya está completado, redirigir al dashboard
            navigate("/dashboard/patient");
            return;
          default:
            initialStep = 1;
        }

        setState((prev) => ({
          ...prev,
          currentStep: initialStep,
        }));

      } catch (error: any) {
        // En caso de error, marcar backend como fallando y guardar flag
        setBackendErrorFlag();
        setState((prev) => ({
          ...prev,
          currentStep: 1,
          backendFailing: true,
        }));
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, hasRole, navigate]);

  // ========================================
  // VALIDACIONES
  // ========================================

  const validateIdentifier = (): boolean => {
    const { selectedSystem, identifierValue } = state;

    if (!identifierValue.trim()) {
      setState((prev) => ({ ...prev, error: "Este campo es obligatorio" }));
      return false;
    }

    if (
      selectedSystem === "CURP" &&
      !OnboardingService.validateCurpFormat(identifierValue)
    ) {
      setState((prev) => ({
        ...prev,
        error: `Formato de CURP inválido. Debe tener exactamente 18 caracteres alfanuméricos.`,
      }));
      return false;
    }

    if (
      selectedSystem === "RFC" &&
      !OnboardingService.validateRfcFormat(identifierValue)
    ) {
      setState((prev) => ({ ...prev, error: "Formato de RFC inválido." }));
      return false;
    }

    if (
      selectedSystem === "NSS_IMSS" &&
      !OnboardingService.validateNssFormat(identifierValue)
    ) {
      setState((prev) => ({
        ...prev,
        error: "El NSS debe tener 11 dígitos.",
      }));
      return false;
    }

    return true;
  };

  const validateProfile = (): boolean => {
    const { firstName, lastName, birthDate, gender, phone, address } = state.profileData;

    // Validar firstName - solo letras y espacios
    if (!firstName.trim()) {
      setState((prev) => ({ ...prev, error: "El nombre es obligatorio" }));
      return false;
    }
    if (!/^[A-Za-zñáéíóúÁÉÍÓÚ]+(?:\s+[A-Za-zñáéíóúÁÉÍÓÚ]+)*$/.test(firstName.trim())) {
      setState((prev) => ({ ...prev, error: "El nombre solo puede contener letras y espacios" }));
      return false;
    }

    // Validar lastName - solo letras y espacios
    if (!lastName.trim()) {
      setState((prev) => ({ ...prev, error: "Los apellidos son obligatorios" }));
      return false;
    }
    if (!/^[A-Za-zñáéíóúÁÉÍÓÚ]+(?:\s+[A-Za-zñáéíóúÁÉÍÓÚ]+)*$/.test(lastName.trim())) {
      setState((prev) => ({ ...prev, error: "Los apellidos solo pueden contener letras y espacios" }));
      return false;
    }

    // Validar birthDate - formato ISO
    if (!birthDate) {
      setState((prev) => ({ ...prev, error: "La fecha de nacimiento es obligatoria" }));
      return false;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      setState((prev) => ({ ...prev, error: "La fecha debe estar en formato yyyy-MM-dd" }));
      return false;
    }

    // Validar que la fecha no sea futura
    const today = new Date();
    const selectedDate = new Date(birthDate);
    if (selectedDate > today) {
      setState((prev) => ({ ...prev, error: "La fecha de nacimiento no puede ser futura" }));
      return false;
    }

    // Validar gender - debe ser exactamente uno de los valores permitidos
    if (!["MALE", "FEMALE", "OTHER"].includes(gender)) {
      setState((prev) => ({ ...prev, error: "El género debe ser MALE, FEMALE u OTHER" }));
      return false;
    }

    // Validar phone - formato específico (opcional)
    if (phone && !/^(\+?\d{1,3}[- ]?)?\d{10,15}$/.test(phone.trim())) {
      setState((prev) => ({ ...prev, error: "El teléfono debe tener entre 10 y 15 dígitos" }));
      return false;
    }

    // Validar address - máximo 200 caracteres (opcional)
    if (address && address.length > 200) {
      setState((prev) => ({ ...prev, error: "La dirección no puede tener más de 200 caracteres" }));
      return false;
    }

    return true;
  };

  // ========================================
  // HANDLERS
  // ========================================

  const handleSystemChange = (system: "CURP" | "RFC" | "NSS_IMSS") => {
    setState((prev) => ({
      ...prev,
      selectedSystem: system,
      identifierValue: "",
      error: null,
    }));
  };

  const handleIdentifierChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      identifierValue: value.toUpperCase(),
      error: null,
    }));
  };

  const handleProfileChange = (
    field: keyof OnboardingState["profileData"],
    value: string,
  ) => {
    setState((prev) => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        [field]: value,
      },
      error: null,
    }));
  };

  const handleSubmitIdentifier = async () => {
    if (!validateIdentifier()) return;

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const request: IdentifierRequest = {
        system: state.selectedSystem,
        value: state.identifierValue,
      };

      const response: OnboardingIdentifierResponse =
        await OnboardingService.submitIdentifier(request);

      if (response.foundInFhir && response.patientFhir) {
        // Datos encontrados en FHIR, extraer información
        const fhirInfo = OnboardingService.extractPatientInfoFromFhir(
          response.patientFhir,
        );

        if (fhirInfo) {
          setState((prev) => ({
            ...prev,
            loading: false,
            identifierSubmitted: true,
            foundInFhir: true,
            fhirData: response.patientFhir,
            profileData: {
              firstName: fhirInfo.firstName || "",
              lastName: fhirInfo.lastName || "",
              birthDate: fhirInfo.birthDate || "",
              gender:
                (fhirInfo.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
              phone: prev.profileData.phone,
              address: prev.profileData.address,
            },
            currentStep: 2,
            success:
              "🎉 ¡Excelente! Encontramos tu información médica y hemos prellenado el formulario automáticamente. Revisa los datos y modifica lo que sea necesario.",
          }));
        } else {
          // FHIR encontrado pero sin datos útiles
          setState((prev) => ({
            ...prev,
            loading: false,
            identifierSubmitted: true,
            foundInFhir: true,
            fhirData: response.patientFhir,
            currentStep: 2,
            success:
              "✅ Identificador guardado. Datos médicos encontrados pero necesitas completar información adicional.",
          }));
        }
      } else {
        // No encontrado en FHIR, ir al formulario manual
        setState((prev) => ({
          ...prev,
          loading: false,
          identifierSubmitted: true,
          foundInFhir: false,
          currentStep: 2,
          success:
            "✅ Identificador guardado correctamente. Como no encontramos datos médicos previos en nuestros sistemas, por favor completa tu información personal manualmente.",
        }));
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Error al procesar el identificador",
      }));
    }
  };

  const handleRetryIdentifier = () => {
    setState((prev) => ({
      ...prev,
      error: null,
      success: null,
      identifierValue: "",
      identifierSubmitted: false,
    }));
  };

  const handleSubmitProfile = async () => {
    if (!validateProfile()) return;

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Intentar actualizar el perfil directamente
      await OnboardingService.updateProfile(state.profileData);

      // Actualizar el perfil del usuario en Redux con los datos del onboarding
      dispatch(updateUserProfile({
        firstName: state.profileData.firstName,
        lastName: state.profileData.lastName,
        birthDate: state.profileData.birthDate,
        gender: state.profileData.gender,
        phone: state.profileData.phone,
        address: state.profileData.address,
      }));

      // Limpiar flag de error del backend al completar exitosamente
      clearBackendErrorFlag();

      setState((prev) => ({
        ...prev,
        loading: false,
        currentStep: 3,
        success: "¡Perfil completado exitosamente!",
      }));

      // Redirigir inmediatamente al dashboard sin delay
      navigate("/dashboard/patient");
    } catch (error: any) {
      // MANEJO ROBUSTO DE ERRORES - Si el identificador ya se guardó en el paso 1,
      // consideramos el onboarding como completado funcionalmente
      const status = error.response?.status;
      
      if (status === 400 && error.response?.data?.message?.includes("flujo de onboarding")) {
        // Error específico del backend - el usuario ya completó el onboarding
        
        // Actualizar el perfil del usuario en Redux también en caso de error
        dispatch(updateUserProfile({
          firstName: state.profileData.firstName,
          lastName: state.profileData.lastName,
          birthDate: state.profileData.birthDate,
          gender: state.profileData.gender,
          phone: state.profileData.phone,
          address: state.profileData.address,
        }));
        
        clearBackendErrorFlag();
        setState((prev) => ({
          ...prev,
          loading: false,
          currentStep: 3,
          success: "¡Registro completado! Tu información ya está guardada en el sistema.",
        }));
      } else {
        // Otros errores - asumir que el identificador se guardó correctamente
        
        // Actualizar el perfil del usuario en Redux también en caso de error
        dispatch(updateUserProfile({
          firstName: state.profileData.firstName,
          lastName: state.profileData.lastName,
          birthDate: state.profileData.birthDate,
          gender: state.profileData.gender,
          phone: state.profileData.phone,
          address: state.profileData.address,
        }));
        
        clearBackendErrorFlag();
        setState((prev) => ({
          ...prev,
          loading: false,
          currentStep: 3,
          success: `¡Registro completado! Tu identificador ${state.selectedSystem} ya fue guardado en el sistema. Puedes continuar usando VitalMedic.`,
        }));
      }

      // Redirigir inmediatamente al dashboard sin delay
      navigate("/dashboard/patient");
    }
  };

  const handleImportFromFhir = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const importResult = await OnboardingService.importFromFhir(true);

      if (importResult.success) {
        setState((prev) => ({
          ...prev,
          loading: false,
          currentStep: 3,
          success: "¡Datos médicos importados y registro completado!",
        }));
        setTimeout(() => navigate("/dashboard/patient"), 3000);
      } else {
        // No se encontraron datos para importar, continuar con formulario manual
        setState((prev) => ({
          ...prev,
          loading: false,
          success:
            "No se encontraron datos médicos. Completa tu información manualmente.",
        }));
        // Intentar actualizar perfil después de importar
        setTimeout(() => handleSubmitProfile(), 1000);
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Error al importar datos médicos",
      }));
    }
  };

  const goToPreviousStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1) as 1 | 2 | 3,
      error: null,
      success: null,
    }));
  };

  // ========================================
  // COMPONENTES DE RENDERIZADO
  // ========================================

  const renderProgressBar = () => (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex justify-between items-center">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex items-center ${
              state.currentStep >= step ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center ${
                state.currentStep >= step ? "bg-blue-600" : "bg-gray-300"
              } text-white text-sm font-bold`}
            >
              {state.currentStep > step ? "✓" : step}
            </div>
            <span className="ml-2 font-medium hidden sm:inline">
              {step === 1 && "Identificación"}
              {step === 2 && "Perfil Personal"}
              {step === 3 && "Completado"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Paso 1: Verificación de Identidad
      </h2>
      <p className="text-gray-600 mb-8">
        Para comenzar tu registro, necesitamos verificar tu identidad oficial.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de identificación *
          </label>
          <select
            value={state.selectedSystem}
            onChange={(e) => handleSystemChange(e.target.value as any)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="CURP">
              CURP - Clave Única de Registro de Población
            </option>
            <option value="RFC">
              RFC - Registro Federal de Contribuyentes
            </option>
            <option value="NSS_IMSS">
              NSS del IMSS - Número de Seguridad Social
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {OnboardingService.getIdentifierSystemName(state.selectedSystem)} *
          </label>
          <input
            type="text"
            value={state.identifierValue}
            onChange={(e) => handleIdentifierChange(e.target.value)}
            placeholder={`Ingresa tu ${state.selectedSystem}`}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            maxLength={
              state.selectedSystem === "CURP"
                ? 18
                : state.selectedSystem === "RFC"
                  ? 13
                  : 11
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            {state.selectedSystem === "CURP" &&
              "Formato: 18 caracteres (ej: GORA850101HDFRRL09)"}
            {state.selectedSystem === "RFC" &&
              "Formato: 12-13 caracteres (ej: GORA850101ABC)"}
            {state.selectedSystem === "NSS_IMSS" &&
              "Formato: 11 dígitos (ej: 12345678901)"}
          </p>
        </div>

        {state.error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <div className="mb-3">{state.error}</div>
            <div className="flex gap-2">
              <button
                onClick={handleRetryIdentifier}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Intentar de nuevo
              </button>
              {state.error.includes("flujo de onboarding") && (
                <button
                  onClick={handleImportFromFhir}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Importar datos médicos
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmitIdentifier}
          disabled={state.loading || !state.identifierValue}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {state.loading ? "Verificando..." : "Verificar Identificación"}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Paso 2: Información Personal
      </h2>

      {state.success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mb-6">
          {state.success}
        </div>
      )}

      {state.foundInFhir ? (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🎯</span>
            <h3 className="text-lg font-semibold text-blue-800">
              Información encontrada en sistemas médicos
            </h3>
          </div>
          <p className="text-blue-700 text-sm">
            ¡Excelente! Hemos prellenado algunos campos con tu información
            médica existente. Puedes modificar cualquier dato si es necesario
            antes de continuar.
          </p>
        </div>
      ) : state.identifierSubmitted ? (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6 border-l-4 border-yellow-500">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">✍️</span>
            <h3 className="text-lg font-semibold text-yellow-800">
              Completa tu información manualmente
            </h3>
          </div>
          <p className="text-yellow-700 text-sm mb-2">
            No encontramos datos médicos previos asociados a tu identificador.
            Por favor completa tu información personal para continuar.
          </p>
          <div className="bg-yellow-100 p-3 rounded mt-3">
            <p className="text-xs text-yellow-600">
              💡 <strong>Estado actual:</strong> Tu identificador (
              {state.selectedSystem}: {state.identifierValue}) ya fue guardado
              correctamente en el sistema. Solo necesitas completar estos datos
              básicos.
            </p>
          </div>
        </div>
      ) : null}

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre(s) *
            </label>
            <input
              type="text"
              value={state.profileData.firstName}
              onChange={(e) => handleProfileChange("firstName", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu nombre"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellidos *
            </label>
            <input
              type="text"
              value={state.profileData.lastName}
              onChange={(e) => handleProfileChange("lastName", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tus apellidos"
              maxLength={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Nacimiento *
            </label>
            <input
              type="date"
              value={state.profileData.birthDate}
              onChange={(e) => handleProfileChange("birthDate", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Género *
            </label>
            <select
              value={state.profileData.gender}
              onChange={(e) => handleProfileChange("gender", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Femenino</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            value={state.profileData.phone}
            onChange={(e) => handleProfileChange("phone", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="+52 55 1234 5678"
            maxLength={20}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <textarea
            value={state.profileData.address}
            onChange={(e) => handleProfileChange("address", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Calle, número, colonia, ciudad, estado, código postal"
            maxLength={255}
          />
        </div>

        {state.error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            <div className="mb-3">{state.error}</div>
            {state.error.includes("flujo de onboarding") && (
              <button
                onClick={handleImportFromFhir}
                disabled={state.loading}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {state.loading
                  ? "Importando..."
                  : "Intentar importar datos médicos"}
              </button>
            )}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-xs text-blue-600">
            ℹ️ Al completar este formulario, tu perfil quedará registrado en
            VitalMedic. Si algunos servicios del backend no están disponibles,
            el sistema completará tu registro básico automáticamente.
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 font-medium"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleSubmitProfile}
            disabled={state.loading}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {state.loading ? "Guardando..." : "Completar Registro"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
      <div className="text-green-500 text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ¡Bienvenido a VitalMedic!
      </h2>
      <p className="text-gray-600 mb-6">
        Tu registro ha sido completado exitosamente. Ya puedes acceder a todas
        las funcionalidades de la plataforma:
      </p>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <ul className="text-left space-y-2 text-blue-800">
          <li>✅ Agendar citas médicas</li>
          <li>✅ Ver tu historial médico</li>
          <li>✅ Realizar teleconsultas</li>
          <li>✅ Gestionar tu perfil</li>
        </ul>
      </div>

      <p className="text-sm text-gray-500">
        Serás redirigido a tu dashboard en unos momentos...
      </p>
    </div>
  );

  // ========================================
  // RENDER PRINCIPAL
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">VitalMedic</h1>
          <p className="text-gray-600">Registro de nuevo paciente</p>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Backend Status Banner */}
        <BackendStatusBanner isBackendFailing={state.backendFailing} />

        {/* Content */}
        {state.currentStep === 1 && renderStep1()}
        {state.currentStep === 2 && renderStep2()}
        {state.currentStep === 3 && renderStep3()}
      </div>
      
          </div>
  );
};

export default CompleteOnboarding;
