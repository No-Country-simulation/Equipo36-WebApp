package com.vitalmedic.VitalMedic.domain.enums;

public enum WeekDay {
    MONDAY("Lunes"),
    TUESDAY("Martes"),
    WEDNESDAY("Miércoles"),
    THURSDAY("Jueves"),
    FRIDAY("Viernes"),
    SATURDAY("Sábado"),
    SUNDAY("Domingo");

    private final String spanishName;

    WeekDay(String spanishName) {
        this.spanishName = spanishName;
    }

    public String getSpanishName() {
        return spanishName;
    }

    @Override
    public String toString() {
        return spanishName;
    }

    /**
     * Convierte desde java.time.DayOfWeek al enum personalizado.
     */
    public static WeekDay fromJavaWeekDay(java.time.DayOfWeek javaWeekDay) {
        if (javaWeekDay == null) {
            throw new IllegalArgumentException("El día de la semana no puede ser nulo");
        }
        return WeekDay.valueOf(javaWeekDay.name());
    }

    /**
     * Convierte desde número (1 = Lunes, 7 = Domingo)
     */
    public static WeekDay fromNumber(int dayNumber) {
        if (dayNumber < 1 || dayNumber > 7) {
            throw new IllegalArgumentException("El número del día debe estar entre 1 (Lunes) y 7 (Domingo)");
        }
        return WeekDay.values()[dayNumber - 1];
    }

    /**
     * Convierte desde texto (case-insensitive)
     */
    public static WeekDay fromString(String dayName) {
        if (dayName == null || dayName.isBlank()) {
            throw new IllegalArgumentException("El nombre del día no puede ser vacío");
        }

        // Permitir coincidencias en inglés o español
        for (WeekDay day : WeekDay.values()) {
            if (day.name().equalsIgnoreCase(dayName) ||
                    day.getSpanishName().equalsIgnoreCase(dayName)) {
                return day;
            }
        }

        throw new IllegalArgumentException("Nombre de día no válido: " + dayName);
    }
}
