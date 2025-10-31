// Utilidad para probar los endpoints del onboarding
import { OnboardingService } from "../services/onboardingService";

export const testOnboardingFlow = async () => {
  try {
    // 1. Verificar estado inicial
    const initialStatus = await OnboardingService.getOnboardingStatus();

    // 2. Probar envío de identificador (ejemplo con CURP)
    try {
      const identifierResponse = await OnboardingService.submitIdentifier({
        system: "CURP",
        value: "GODE561231MVZRRL04"
      });
    } catch (error: any) {
      // Error esperado (identificador de prueba)
    }

    // 3. Verificar estado después del identificador
    const afterIdentifierStatus = await OnboardingService.getOnboardingStatus();

    // 4. Probar actualización de perfil
    try {
      const profileResponse = await OnboardingService.updateProfile({
        firstName: "Juan",
        lastName: "Pérez",
        birthDate: "1990-05-15",
        gender: "MALE",
        phone: "+52 55 1234 5678",
        address: "Av. Principal 123, Ciudad de México"
      });
    } catch (error: any) {
      // Error al actualizar perfil
    }

    // 5. Verificar estado final
    const finalStatus = await OnboardingService.getOnboardingStatus();

  } catch (error: any) {
    // Error en las pruebas
  }
};

// Para usar en consola de desarrollo:
// import { testOnboardingFlow } from './utils/testOnboarding';
// testOnboardingFlow();
