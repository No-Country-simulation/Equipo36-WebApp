package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.patient.OnbordingIdentifierRequest;
import com.vitalmedic.VitalMedic.domain.dto.patient.OnbordingIdentifierResponse;
import com.vitalmedic.VitalMedic.domain.entity.Patient;
import com.vitalmedic.VitalMedic.domain.entity.PatientIdentifier;
import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.repository.PatientIdentifierRepository;
import com.vitalmedic.VitalMedic.repository.PatientRepository;
import com.vitalmedic.VitalMedic.repository.UserRepository;
import com.vitalmedic.VitalMedic.service.FhirPatientService;
import com.vitalmedic.VitalMedic.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientIdentifierRepository patientIdentifierRepository;
    private final PatientRepository patientRepository;
    private final FhirPatientService fhirPatientService;
    private final UserRepository userRepository;


    @Override
    public OnbordingIdentifierResponse addIdentifierAndSearchInFhir(OnbordingIdentifierRequest request) {
        Optional<PatientIdentifier> existingIdentifier =
                patientIdentifierRepository.findBySystemAndValue(request.system(), request.value());

        if(existingIdentifier.isEmpty()){
            //error
        }

        //Obtener el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UUID keivloakId =UUID.fromString(authentication.getName());
        User user = userRepository.findByKeycloakId(keivloakId).orElseThrow();

        Patient patient = new Patient();
        patient.setUser(user);
        patientRepository.save(patient);

        PatientIdentifier patientIdentifier = new PatientIdentifier();
        patientIdentifier.setPatient(patient);
        patientIdentifier.setSystem(request.system());
        patientIdentifier.setValue(request.value());

        patientIdentifierRepository.save(patientIdentifier);



        //Buscar en FHIR
        Optional<org.hl7.fhir.r4.model.Patient> fhirResult = fhirPatientService.findPatientByIdentifier(request.system().getSystemUrl(),request.value());
        if(fhirResult.isEmpty()){
            return new OnbordingIdentifierResponse(false,null);
        }
        else {
            return new OnbordingIdentifierResponse(true,fhirResult.get());
        }

    }
}
