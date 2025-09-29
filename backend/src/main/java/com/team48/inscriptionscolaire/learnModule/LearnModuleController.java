package com.team48.inscriptionscolaire.learnModule;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/modules")
@RequiredArgsConstructor
public class LearnModuleController {
    
    private final LearnModuleService learnModuleService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LearnModuleDTO> createModule(@RequestBody LearnModuleDTO dto) {
        return ResponseEntity.ok(learnModuleService.createModule(dto));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LearnModuleDTO> getModuleById(@PathVariable Integer id) {
        return ResponseEntity.ok(learnModuleService.getModuleById(id));
    }
    
    @GetMapping("/program/{programId}")
    public ResponseEntity<List<LearnModuleDTO>> getModulesByProgramId(@PathVariable Integer programId) {
        return ResponseEntity.ok(learnModuleService.getModulesByProgramId(programId));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LearnModuleDTO> updateModule(@PathVariable Integer id, @RequestBody LearnModuleDTO dto) {
        return ResponseEntity.ok(learnModuleService.updateModule(id, dto));
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
        return ResponseEntity.ok(learnModuleService.addModuleToProgram(programId, dto));
    }
}