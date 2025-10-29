import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { OnboardingService } from '../../services/onboardingService';
import { getOnboardingDebugInfo, setBackendErrorFlag, clearBackendErrorFlag, isBackendErrorFlagSet } from '../../utils/onboardingUtils';

/**
 * OnboardingDebug - Componente para debugging y testing del onboarding
 * 
 * Este componente ayuda a:
 * 1. Ver el estado actual del onboarding
 * 2. Probar las APIs del backend
 * 3. Simular diferentes estados
 * 4. Debuggear problemas de conexión
 */
const OnboardingDebug: React.FC = () => {
  const { 
    isAuthenticated, 
    hasRole, 
    onboardingStatus, 
    needsOnboarding,
    shouldRedirectToOnboarding,
    isCheckingOnboarding 
  } = useAuth();
  
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkOnboardingStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const status = await OnboardingService.getOnboardingStatus();
      setDebugInfo({ type: 'status', data: status });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await OnboardingService.checkUserData();
      setDebugInfo({ type: 'userData', data: userData });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testIdentifier = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar un CURP de prueba válido
      const testCurp = "GORA850101HDFRRL09";
      const result = await OnboardingService.submitCurp(testCurp);
      setDebugInfo({ type: 'identifier', data: result });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testProfileUpdate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const testProfile = {
        firstName: "Juan",
        lastName: "Pérez",
        birthDate: "1990-01-01",
        gender: "MALE" as const,
        phone: "+52 55 1234 5678",
        address: "Calle de prueba 123"
      };
      
      const result = await OnboardingService.updateProfile(testProfile);
      setDebugInfo({ type: 'profile', data: result });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDebugInfo = () => {
    const info = getOnboardingDebugInfo();
    setDebugInfo({ type: 'debugInfo', data: info });
  };

  const handleSetBackendErrorFlag = () => {
    setBackendErrorFlag();
    getDebugInfo();
  };

  const handleClearBackendErrorFlag = () => {
    clearBackendErrorFlag();
    getDebugInfo();
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h3 className="font-bold">🔒 Debug Onboarding</h3>
        <p>Necesitas estar autenticado para usar este componente de debug.</p>
      </div>
    );
  }

  if (!hasRole('PATIENT')) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <h3 className="font-bold">⚠️ Debug Onboarding</h3>
        <p>Este componente solo está disponible para usuarios con rol PATIENT.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">🔧 Debug Onboarding</h3>
      
      {/* Estado actual */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold text-blue-800 mb-2">Estado Actual:</h4>
        <div className="space-y-1 text-sm">
          <div><strong>Autenticado:</strong> {isAuthenticated ? '✅' : '❌'}</div>
          <div><strong>Rol PATIENT:</strong> {hasRole('PATIENT') ? '✅' : '❌'}</div>
          <div><strong>Estado Onboarding:</strong> {onboardingStatus || 'No disponible'}</div>
          <div><strong>Necesita Onboarding:</strong> {needsOnboarding ? '✅' : '❌'}</div>
          <div><strong>Debería Redirigir:</strong> {shouldRedirectToOnboarding ? '✅' : '❌'}</div>
          <div><strong>Verificando Estado:</strong> {isCheckingOnboarding ? '⏳' : '✅'}</div>
          <div><strong>Backend Error Flag:</strong> {isBackendErrorFlagSet() ? '🚩' : '✅'}</div>
        </div>
      </div>

      {/* Controles del Backend Error Flag */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800 mb-3">🚩 Backend Error Flag:</h4>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={getDebugInfo}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            🔍 Ver Info Debug
          </button>
          
          <button
            onClick={handleSetBackendErrorFlag}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🚩 Marcar Error Backend
          </button>
          
          <button
            onClick={handleClearBackendErrorFlag}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🧹 Limpiar Flag
          </button>
        </div>
        <p className="text-xs text-yellow-700 mt-2">
          💡 Usa estos controles para simular errores del backend y probar el comportamiento del sistema.
        </p>
      </div>

      {/* Botones de prueba */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Pruebas de API:</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={checkOnboardingStatus}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '⏳' : '🔍'} Estado Onboarding
          </button>
          
          <button
            onClick={checkUserData}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? '⏳' : '👤'} Datos Usuario
          </button>
          
          <button
            onClick={testIdentifier}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? '⏳' : '🆔'} Probar CURP
          </button>
          
          <button
            onClick={testProfileUpdate}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? '⏳' : '📝'} Probar Perfil
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <h5 className="font-semibold">❌ Error:</h5>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Resultado */}
      {debugInfo && (
        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <h5 className="font-semibold text-gray-800 mb-2">
            📊 Resultado ({debugInfo.type}):
          </h5>
          <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
            {JSON.stringify(debugInfo.data, null, 2)}
          </pre>
        </div>
      )}

      {/* Información del backend */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded">
        <h5 className="font-semibold text-gray-800 mb-2">🌐 Backend Info:</h5>
        <div className="text-sm space-y-1">
          <div><strong>URL:</strong> https://vitalmedic-backend.onrender.com</div>
          <div><strong>Swagger:</strong> https://vitalmedic-backend.onrender.com/swagger-ui/index.html</div>
          <div><strong>ReDoc:</strong> https://vitalmedic-backend.onrender.com/redoc.html</div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDebug;