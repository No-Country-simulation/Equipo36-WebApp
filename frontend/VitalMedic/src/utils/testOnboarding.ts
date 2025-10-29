// Utilidad para probar los endpoints del onboarding
import { OnboardingService } from "../services/onboardingService";

export const testOnboardingFlow = async () => {
  console.log("🧪 Iniciando pruebas del flujo de onboarding...");

  try {
    // 1. Verificar estado inicial
    console.log("\n1️⃣ Verificando estado inicial del onboarding...");
    const initialStatus = await OnboardingService.getOnboardingStatus();
    console.log("Estado inicial:", initialStatus);

    // 2. Probar envío de identificador (ejemplo con CURP)
    console.log("\n2️⃣ Enviando identificador de prueba...");
    try {
      const identifierResponse = await OnboardingService.submitIdentifier({
        system: "CURP",
        value: "GODE561231MVZRRL04"
      });
      console.log("Respuesta del identificador:", identifierResponse);
    } catch (error: any) {
      console.log("Error esperado (identificador de prueba):", error.message);
    }

    // 3. Verificar estado después del identificador
    console.log("\n3️⃣ Verificando estado después del identificador...");
    const afterIdentifierStatus = await OnboardingService.getOnboardingStatus();
    console.log("Estado después del identificador:", afterIdentifierStatus);

    // 4. Probar actualización de perfil
    console.log("\n4️⃣ Actualizando perfil de prueba...");
    try {
      const profileResponse = await OnboardingService.updateProfile({
        firstName: "Juan",
        lastName: "Pérez",
        birthDate: "1990-05-15",
        gender: "MALE",
        phone: "+52 55 1234 5678",
        address: "Av. Principal 123, Ciudad de México"
      });
      console.log("Perfil actualizado:", profileResponse);
    } catch (error: any) {
      console.log("Error al actualizar perfil:", error.message);
    }

    // 5. Verificar estado final
    console.log("\n5️⃣ Verificando estado final del onboarding...");
    const finalStatus = await OnboardingService.getOnboardingStatus();
    console.log("Estado final:", finalStatus);

    console.log("\n✅ Pruebas completadas");

  } catch (error: any) {
    console.error("\n❌ Error en las pruebas:", error);
  }
};

// Para usar en consola de desarrollo:
// import { testOnboardingFlow } from './utils/testOnboarding';
// testOnboardingFlow();
