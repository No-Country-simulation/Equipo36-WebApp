package com.vitalmedic.VitalMedic.service.fihr.impl;

import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import com.vitalmedic.VitalMedic.domain.entity.AppointmentEntity;
import com.vitalmedic.VitalMedic.service.fihr.FhirAppointmentService;
import lombok.RequiredArgsConstructor;
import org.hl7.fhir.r4.model.Appointment;
import org.hl7.fhir.r4.model.Reference;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class FhirAppointmentServiceImpl implements FhirAppointmentService {
    private final IGenericClient fhirClient;

    @Override
    public String createAppointmentInFhir(AppointmentEntity appointment) {
        // Convertir tu entidad local a FHIR
        Appointment fhirAppointment = new Appointment();

        fhirAppointment.setStatus(Appointment.AppointmentStatus.BOOKED);
        fhirAppointment.setDescription("Consulta con el Dr. " + appointment.getDoctor().getFirstName()+" "+appointment.getDoctor().getLastName());

        // Fecha y hora
        LocalDateTime start = LocalDateTime.of(appointment.getDate(), appointment.getStartTime());
        LocalDateTime end = LocalDateTime.of(appointment.getDate(), appointment.getEndTime());
        fhirAppointment.setStart(Date.from(start.atZone(ZoneId.systemDefault()).toInstant()));
        fhirAppointment.setEnd(Date.from(end.atZone(ZoneId.systemDefault()).toInstant()));

        // Participantes
        Reference patientRef = new Reference("Patient/" + appointment.getPatient().getFhirId());
        Reference doctorRef = new Reference("Practitioner/" + appointment.getDoctor().getFhirId());

        fhirAppointment.addParticipant()
                .setActor(patientRef)
                .setStatus(Appointment.ParticipationStatus.ACCEPTED);

        fhirAppointment.addParticipant()
                .setActor(doctorRef)
                .setStatus(Appointment.ParticipationStatus.ACCEPTED);

        // Crear en servidor FHIR
        MethodOutcome outcome = fhirClient.create()
                .resource(fhirAppointment)
                .execute();

        // Retornar el ID asignado por FHIR
        return outcome.getId().getIdPart();
    }

    @Override
    public void updateAppointmentFhirStatus(String fhirId, String newStatusCode) {
        // Leer el Appointment
        Appointment appointment = fhirClient.read()
                .resource(Appointment.class)
                .withId(fhirId)
                .execute();

        // Actualizar estado
        appointment.setStatus(Appointment.AppointmentStatus.fromCode(newStatusCode.toLowerCase()));

        // Guardar cambios en el servidor FHIR
        fhirClient.update()
                .resource(appointment)
                .execute();
    }
}
