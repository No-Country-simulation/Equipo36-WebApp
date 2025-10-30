package com.vitalmedic.VitalMedic.domain.enums;

public enum AppointmentStatus {
    PROPOSED("Propuesta"),
    PENDING("Pendiente"),
    BOOKED("Reservada"),
    ARRIVED("Paciente llegado"),
    FULFILLED("Completada"),
    CANCELLED("Cancelada"),
    NOSHOW("No se presentó"),
    ENTEREDINERROR("Error de registro"),
    CHECKEDIN("En registro"),
    WAITLIST("En lista de espera");

    private final String label;

    AppointmentStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
