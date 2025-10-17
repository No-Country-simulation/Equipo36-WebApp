package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorResponseDTO;
import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorUpdateDTO;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.mapper.DoctorMapper;
import com.vitalmedic.VitalMedic.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Tag(name = "Doctor", description = "CRUD de doctores en el sistema")
@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorMapper doctorMapper;

    @Operation(summary = "Obtener todos los doctores", description = "Devuelve una lista de todos los doctores registrados en el sistema.")
    @GetMapping
    public ResponseEntity<List<DoctorResponseDTO>> getAllDoctors() {
        List<DoctorEntity> doctors = doctorService.getAllDoctors();
        List<DoctorResponseDTO> response = doctors.stream()
                .map(doctorMapper::toDoctorResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Obtener un doctor por ID", description = "Devuelve los datos de un doctor a partir de su identificador UUID.")
    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponseDTO> getDoctorById(@PathVariable UUID id) {
        DoctorEntity doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(doctorMapper.toDoctorResponseDTO(doctor));
    }

    @Operation(summary = "Actualizar un doctor", description = "Permite modificar datos de un doctor usando un DTO de actualización.")
    @PutMapping("/{id}")
    public ResponseEntity<DoctorResponseDTO> updateDoctor(@PathVariable UUID id,
                                                          @Valid @RequestBody DoctorUpdateDTO dto) {
        DoctorEntity updated = doctorService.updateDoctor(id, dto);
        return ResponseEntity.ok(doctorMapper.toDoctorResponseDTO(updated));
    }

    @Operation(summary = "Eliminar un doctor", description = "Borra un doctor del sistema por su ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable UUID id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
