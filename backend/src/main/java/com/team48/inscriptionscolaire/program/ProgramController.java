package com.team48.inscriptionscolaire.program;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    // Accessible uniquement par les admins
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProgramResponseDTO> createProgram(@RequestBody ProgramRequestDTO dto) {
        return ResponseEntity.ok(programService.createProgram(dto));
    }


    @GetMapping
    public ResponseEntity<List<ProgramResponseDTO>> getAllPrograms() {
        return ResponseEntity.ok(programService.getAllPrograms());
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProgramResponseDTO> getProgramById(@PathVariable Integer id) {
        return ResponseEntity.ok(programService.getProgramById(id));
    }

    @GetMapping("/code/{programCode}")
    public ResponseEntity<ProgramResponseDTO> getProgramByCode(@PathVariable String programCode) {
        return ResponseEntity.ok(programService.getProgramByCode(programCode));
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProgramResponseDTO> updateProgram(@PathVariable Integer id, @RequestBody ProgramRequestDTO dto) {
        return ResponseEntity.ok(programService.updateProgram(id, dto));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProgram(@PathVariable Integer id) {
        programService.deleteProgram(id);
        return ResponseEntity.noContent().build();
    }
}
