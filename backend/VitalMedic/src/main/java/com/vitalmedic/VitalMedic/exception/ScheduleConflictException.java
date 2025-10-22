package com.vitalmedic.VitalMedic.exception;

public class ScheduleConflictException extends RuntimeException {
    public ScheduleConflictException(String message){
        super(message);
    }
}
