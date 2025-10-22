package com.vitalmedic.VitalMedic.domain.enums;

public enum WeekDay {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY;

    /**
     * Convierte desde java.time.WeekDay (el enum estándar de Java)
     * al enum personalizado de la aplicación.
     */
    public static WeekDay fromJavaWeekDay(java.time.DayOfWeek javaWeekDay) {
        if (javaWeekDay == null) {
            throw new IllegalArgumentException("El día de la semana no puede ser nulo");
        }
        return WeekDay.valueOf(javaWeekDay.name());
    }

    /**
     * Convierte desde número (1 = MONDAY, 7 = SUNDAY)
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
        return WeekDay.valueOf(dayName.trim().toUpperCase());
    }
}
