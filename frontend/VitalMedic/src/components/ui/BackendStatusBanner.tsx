import React from 'react';

interface BackendStatusBannerProps {
  isBackendFailing: boolean;
}

/**
 * BackendStatusBanner - Muestra el estado del backend cuando está fallando
 * 
 * Este componente ayuda al usuario a entender por qué algunas funciones
 * pueden no estar funcionando correctamente.
 */
const BackendStatusBanner: React.FC<BackendStatusBannerProps> = ({ isBackendFailing }) => {
  if (!isBackendFailing) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="shrink-0">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Backend Temporalmente No Disponible
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              El servidor backend está experimentando problemas técnicos. 
              Puedes completar tu registro y usar las funciones básicas de la aplicación.
            </p>
            <p className="mt-1">
              <strong>Estado:</strong> Funcionando en modo limitado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendStatusBanner;
