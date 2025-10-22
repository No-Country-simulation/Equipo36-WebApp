package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.domain.dto.ApiResult;
import com.vitalmedic.VitalMedic.domain.dto.specialty.SpecialtyRequest;
import com.vitalmedic.VitalMedic.domain.dto.specialty.SpecialtyResponse;
import com.vitalmedic.VitalMedic.service.SpecialtyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Especialidad Medica")
@RestController
@RequestMapping("/api/specialty")
@RequiredArgsConstructor
public class SpecialtyController {

    private final SpecialtyService specialtyService;

    @GetMapping
    public ResponseEntity<?> getAllSpecialty(){
        var specialtyes = specialtyService.getAllSpecialty();
        return ResponseEntity.ok(ApiResult.success(specialtyes, "Lista de especialidades de los doctores"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSpecialtyById(@PathVariable Long id){
        SpecialtyResponse specialty = specialtyService.getSpecialtyById(id);
        return ResponseEntity.ok(ApiResult.success(specialty,"Especialidad encontrada"));
    }

    @PostMapping()
    public ResponseEntity<?> createSpecialty(@RequestBody @Valid SpecialtyRequest request){
        SpecialtyResponse specialty = specialtyService.creatSpecialty(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResult.success(specialty,"Especialidad creada"));

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSpecialty(@PathVariable Long id, @RequestBody @Valid SpecialtyRequest request){
        SpecialtyResponse specialty = specialtyService.updateSpecialty(id, request);
        return ResponseEntity.ok(ApiResult.success(specialty,"Especialidad actualizada"));
    }
}
