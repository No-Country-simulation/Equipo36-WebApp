package com.vitalmedic.VitalMedic.domain.enums;

public enum IdentifierSystem {

    CURP("https://www.gob.mx/curp", "CURP"),
    RFC("https://www.sat.gob.mx/rfc", "RFC"),
    NSS_IMSS("https://imss.gob.mx/nss", "Número de Seguridad Social (IMSS)"),
    ISSSTE("https://issste.gob.mx/afiliacion", "Número de Afiliación ISSSTE"),
    PRIVATE_INSURANCE("https://vitalmedic.com/insurance-id", "Seguro Privado"),
    VITALMEDIC_INTERNAL("https://vitalmedic.com/patient-id", "Identificador Interno VitalMedic");

    private final String systemUrl;
    private final String displayName;

    IdentifierSystem(String systemUrl, String displayName) {
        this.systemUrl = systemUrl;
        this.displayName = displayName;
    }

    public String getSystemUrl() {
        return systemUrl;
    }

    public String getDisplayName() {
        return displayName;
    }
}
