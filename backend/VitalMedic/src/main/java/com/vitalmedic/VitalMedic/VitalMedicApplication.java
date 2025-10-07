package com.vitalmedic.VitalMedic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@ConfigurationPropertiesScan(basePackages = "com.vitalmedic.VitalMedic.config")
@SpringBootApplication
public class VitalMedicApplication {

	public static void main(String[] args) {
		SpringApplication.run(VitalMedicApplication.class, args);
	}

}
