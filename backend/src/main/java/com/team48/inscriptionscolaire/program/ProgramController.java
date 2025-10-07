package com.team48.inscriptionscolaire.program;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    // Accessible uniquement par les admins
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProgramResponseDTO> createProgram(@RequestBody ProgramRequestDTO dto) {
        Program program = programService.createProgram(dto);
        ProgramResponseDTO response = ProgramMapper.toDto(program);
        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<List<ProgramResponseDTO>> getAllPrograms() {
        List<Program> programs = programService.getAllPrograms();
        List<ProgramResponseDTO> responses = programs.stream()
                .map(this::createProgramResponseWithEnrollmentStatus)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProgramResponseDTO> getProgramById(@PathVariable Integer id) {
        Program program = programService.getProgramById(id);
        ProgramResponseDTO response = createProgramResponseWithEnrollmentStatus(program);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{programCode}")
    public ResponseEntity<ProgramResponseDTO> getProgramByCode(@PathVariable String programCode) {
        Program program = programService.getProgramByCode(programCode);
        ProgramResponseDTO response = createProgramResponseWithEnrollmentStatus(program);
        return ResponseEntity.ok(response);
    }

    /**
     * Create program response DTO with proper enrollment status calculation
     */
    private ProgramResponseDTO createProgramResponseWithEnrollmentStatus(Program program) {
        ProgramResponseDTO dto = ProgramMapper.toDto(program);

        // Override enrollment status with proper logic
        // For now, use the basic logic, but this should be enhanced to check for student conflicts
        dto.setEnrollmentOpen(calculateEnrollmentStatus(program));

        return dto;
    }

    /**
     * Calculate if enrollment is open considering business rules
     */
    private boolean calculateEnrollmentStatus(Program program) {
        // 1. Check if enrollment period is open (basic check)
        LocalDate today = LocalDate.now();
        boolean isInEnrollmentPeriod = program.getRegistrationStartDate() != null &&
                                     program.getRegistrationEndDate() != null &&
                                     !today.isBefore(program.getRegistrationStartDate()) &&
                                     !today.isAfter(program.getRegistrationEndDate());

        if (!isInEnrollmentPeriod) {
            return false;
        }

        // TODO: 2. Check for schedule conflicts (requires student context)
        // TODO: 3. Check admin overrides
        // TODO: 4. Check capacity limits

        // For now, return the period-based status
        return true;
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProgramResponseDTO> updateProgram(@PathVariable Integer id, @RequestBody ProgramRequestDTO dto) {
        Program program = programService.updateProgram(id, dto);
        ProgramResponseDTO response = ProgramMapper.toDto(program);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProgram(@PathVariable Integer id) {
        programService.deleteProgram(id);
        return ResponseEntity.noContent().build();
    }
}