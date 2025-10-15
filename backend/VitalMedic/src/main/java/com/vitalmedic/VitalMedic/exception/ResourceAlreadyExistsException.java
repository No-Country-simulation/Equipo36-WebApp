package com.vitalmedic.VitalMedic.exception;

public class ResourceAlreadyExistsException extends RuntimeException {
    public ResourceAlreadyExistsException(String mesage){
        super(mesage);
    }
}
