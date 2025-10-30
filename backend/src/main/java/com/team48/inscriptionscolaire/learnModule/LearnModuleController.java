package com.team48.inscriptionscolaire.learnModule;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/modules")
@RequiredArgsConstructor
public class LearnModuleController {

    private final LearnModuleService learnModuleService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LearnModuleDTO> createModule(@RequestBody LearnModuleDTO dto) {
        LearnModule module = learnModuleService.createModule(dto);
        LearnModuleDTO response = LearnModuleMapper.toDto(module);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearnModuleDTO> getModuleById(@PathVariable Integer id) {
        LearnModule module = learnModuleService.getModuleById(id);
        LearnModuleDTO response = LearnModuleMapper.toDto(module);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/program/{programId}")
    public ResponseEntity<List<LearnModuleDTO>> getModulesByProgramId(@PathVariable Integer programId) {
        List<LearnModule> modules = learnModuleService.getModulesByProgramId(programId);
        List<LearnModuleDTO> responses = modules.stream()
                .map(LearnModuleMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LearnModuleDTO> updateModule(@PathVariable Integer id, @RequestBody LearnModuleDTO dto) {
        LearnModule module = learnModuleService.updateModule(id, dto);
        LearnModuleDTO response = LearnModuleMapper.toDto(module);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteModule(@PathVariable Integer id) {
        learnModuleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/program/{programId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LearnModuleDTO> addModuleToProgram(@PathVariable Integer programId, @RequestBody LearnModuleDTO dto) {
        LearnModule module = learnModuleService.addModuleToProgram(programId, dto);
        LearnModuleDTO response = LearnModuleMapper.toDto(module);
        return ResponseEntity.ok(response);
    }
}