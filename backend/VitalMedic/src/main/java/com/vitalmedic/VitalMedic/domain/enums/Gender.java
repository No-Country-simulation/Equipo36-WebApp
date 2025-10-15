package com.vitalmedic.VitalMedic.domain.enums;

import java.util.Arrays;

public enum Gender {

    MALE("Masculino"),
    FEMALE("Femenino"),
    OTHER("Otro");

    private final String displayName;

    Gender(String displayName) {
        this.displayName = displayName;
    }

    /**
     * Obtiene el nombre que se mostrará en español.
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Convierte un display name en español al enum correspondiente.
     * Si no coincide, devuelve OTHER.
     * Ejemplo: "Masculino" → MALE
     */
    public static Gender fromDisplayName(String displayName) {
        if (displayName == null) return OTHER;
        return Arrays.stream(values())
                .filter(g -> g.displayName.equalsIgnoreCase(displayName))
                .findFirst()
                .orElse(OTHER);
    }

    /**
     * Convierte una cadena en inglés (en mayúsculas o minúsculas) al enum correspondiente.
     * Si el valor no coincide con MALE o FEMALE, devuelve OTHER.
     * Ejemplo: "MALE" o "male" → MALE
     */
    public static Gender fromEnglish(String englishValue) {
        if (englishValue == null) return OTHER;
        try {
            return Gender.valueOf(englishValue.toUpperCase());
        } catch (IllegalArgumentException e) {
            return OTHER;
        }
    }
}
