package com.team48.inscriptionscolaire.program;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/programs")
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


    @GetMapping("/all")
    public ResponseEntity<List<ProgramResponseDTO>> getAllPrograms() {
        List<Program> programs = programService.getAllPrograms();
        List<ProgramResponseDTO> responses = programs.stream()
                .map(ProgramMapper::toDtoWithEnrollmentStatus)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Add mapping for the base path to maintain compatibility with frontend
    @GetMapping
    public ResponseEntity<List<ProgramResponseDTO>> getAllProgramsWithoutPath() {
        return getAllPrograms();
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProgramResponseDTO> getProgramById(@PathVariable Integer id) {
        Program program = programService.getProgramById(id);
        ProgramResponseDTO response = ProgramMapper.toDtoWithEnrollmentStatus(program);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{programCode}")
    public ResponseEntity<ProgramResponseDTO> getProgramByCode(@PathVariable String programCode) {
        Program program = programService.getProgramByCode(programCode);
        ProgramResponseDTO response = ProgramMapper.toDtoWithEnrollmentStatus(program);
        return ResponseEntity.ok(response);
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