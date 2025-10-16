import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientService } from '../../services/patientService';

interface PatientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  curp: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalHistory: string;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'MALE',
    curp: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalHistory: ''
  });

  const [curpValidated, setCurpValidated] = useState(false);

  const validateCURP = async () => {
    if (!patientInfo.curp || patientInfo.curp.length !== 18) {
      setError('El CURP debe tener exactamente 18 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await PatientService.verifyCurp(patientInfo.curp);
      if (response.exists) {
        setError('Este CURP ya está registrado en el sistema');
        setCurpValidated(false);
      } else {
        setSuccess('CURP disponible - puedes continuar con el registro');
        setCurpValidated(true);
      }
    } catch (error) {
      console.error('Error validating CURP:', error);
      setError('Error al validar el CURP. Inténtalo nuevamente.');
      setCurpValidated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PatientInfo, value: string) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'curp') {
      setCurpValidated(false);
      setError(null);
      setSuccess(null);
    }
  };

  const nextStep = () => {
    setError(null);
    setSuccess(null);
    
    if (currentStep === 1) {
      if (!curpValidated) {
        setError('Debes validar tu CURP antes de continuar');
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setError(null);
    setSuccess(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitRegistration = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await PatientService.createPatient(patientInfo);
      console.log('Paciente creado exitosamente:', response);
      setSuccess('¡Registro completado exitosamente!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating patient:', error);
      setError(error.response?.data?.message || 'Error al crear el perfil del paciente');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="step-content">
      <h2>Paso 1: Verificación de CURP</h2>
      <p>Primero necesitamos verificar tu CURP para asegurarnos de que no estés registrado previamente.</p>
      
      <div className="form-group">
        <label htmlFor="curp">CURP *</label>
        <input
          type="text"
          id="curp"
          value={patientInfo.curp}
          onChange={(e) => handleInputChange('curp', e.target.value.toUpperCase())}
          placeholder="Ingresa tu CURP (18 caracteres)"
          maxLength={18}
          className={curpValidated ? 'validated' : ''}
          required
        />
        
        <button 
          type="button" 
          onClick={validateCURP} 
          disabled={loading || patientInfo.curp.length !== 18}
          className="verify-btn"
        >
          {loading ? 'Verificando...' : 'Verificar CURP'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="step-navigation">
        <button 
          type="button" 
          onClick={nextStep} 
          disabled={!curpValidated}
          className="next-btn"
        >
          Siguiente
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h2>Paso 2: Información Personal</h2>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">Nombre(s) *</label>
          <input
            type="text"
            id="firstName"
            value={patientInfo.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Apellidos *</label>
          <input
            type="text"
            id="lastName"
            value={patientInfo.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico *</label>
          <input
            type="email"
            id="email"
            value={patientInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Teléfono *</label>
          <input
            type="tel"
            id="phone"
            value={patientInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dateOfBirth">Fecha de Nacimiento *</label>
          <input
            type="date"
            id="dateOfBirth"
            value={patientInfo.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">Género *</label>
          <select
            id="gender"
            value={patientInfo.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            required
          >
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Femenino</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="step-navigation">
        <button type="button" onClick={prevStep} className="prev-btn">
          Anterior
        </button>
        <button 
          type="button" 
          onClick={nextStep}
          disabled={!patientInfo.firstName || !patientInfo.lastName || !patientInfo.email || !patientInfo.phone || !patientInfo.dateOfBirth}
          className="next-btn"
        >
          Siguiente
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <h2>Paso 3: Información de Contacto y Dirección</h2>
      
      <div className="form-group">
        <label htmlFor="address">Dirección Completa *</label>
        <textarea
          id="address"
          value={patientInfo.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Calle, número, colonia, ciudad, estado, código postal"
          rows={3}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="emergencyContactName">Contacto de Emergencia (Nombre) *</label>
          <input
            type="text"
            id="emergencyContactName"
            value={patientInfo.emergencyContactName}
            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="emergencyContactPhone">Contacto de Emergencia (Teléfono) *</label>
          <input
            type="tel"
            id="emergencyContactPhone"
            value={patientInfo.emergencyContactPhone}
            onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
            required
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="step-navigation">
        <button type="button" onClick={prevStep} className="prev-btn">
          Anterior
        </button>
        <button 
          type="button" 
          onClick={nextStep}
          disabled={!patientInfo.address || !patientInfo.emergencyContactName || !patientInfo.emergencyContactPhone}
          className="next-btn"
        >
          Siguiente
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="step-content">
      <h2>Paso 4: Historial Médico (Opcional)</h2>
      
      <div className="form-group">
        <label htmlFor="medicalHistory">Historial Médico</label>
        <textarea
          id="medicalHistory"
          value={patientInfo.medicalHistory}
          onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
          placeholder="Describe cualquier condición médica relevante, alergias, medicamentos actuales, cirugías previas, etc."
          rows={6}
        />
        <small>Esta información es opcional pero nos ayuda a brindarte un mejor servicio médico.</small>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="step-navigation">
        <button type="button" onClick={prevStep} className="prev-btn">
          Anterior
        </button>
        <button 
          type="button" 
          onClick={submitRegistration}
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Registrando...' : 'Completar Registro'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>Registro de Paciente - VitalMedic</h1>
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step} 
                className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="onboarding-content">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default Onboarding;
