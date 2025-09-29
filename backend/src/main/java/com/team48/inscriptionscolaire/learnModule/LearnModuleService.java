package com.team48.inscriptionscolaire.learnModule;

import com.team48.inscriptionscolaire.program.Program;
import com.team48.inscriptionscolaire.program.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearnModuleService {
    
    private final LearnModuleRepository learnModuleRepository;
    private final ProgramRepository programRepository;
    
    public LearnModuleDTO createModule(LearnModuleDTO dto) {
        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + dto.getProgramId()));
        
        LearnModule module = LearnModuleMapper.toEntity(dto, program);
        return LearnModuleMapper.toDto(learnModuleRepository.save(module));
    }
    
    public LearnModuleDTO getModuleById(Integer id) {
        LearnModule module = learnModuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learn module not found with id: " + id));
        return LearnModuleMapper.toDto(module);
    }
    
    public List<LearnModuleDTO> getModulesByProgramId(Integer programId) {
        return learnModuleRepository.findByProgramIdOrderByModuleOrder(programId)
                .stream()
                .map(LearnModuleMapper::toDto)
                .collect(Collectors.toList());
    }
    
    public LearnModuleDTO updateModule(Integer id, LearnModuleDTO dto) {
        LearnModule existingModule = learnModuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learn module not found with id: " + id));
        
        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + dto.getProgramId()));
        
        existingModule.setModuleName(dto.getModuleName());
        existingModule.setModuleDescription(dto.getModuleDescription());
        existingModule.setModuleOrder(dto.getModuleOrder());
        existingModule.setProgram(program);
        
        return LearnModuleMapper.toDto(learnModuleRepository.save(existingModule));
    }
    
    public void deleteModule(Integer id) {
        if (!learnModuleRepository.existsById(id)) {
            throw new RuntimeException("Learn module not found with id: " + id);
        }
        learnModuleRepository.deleteById(id);
    }
    
    public LearnModuleDTO addModuleToProgram(Integer programId, LearnModuleDTO dto) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + programId));
        
        dto.setProgramId(programId);
        LearnModule module = LearnModuleMapper.toEntity(dto, program);
        return LearnModuleMapper.toDto(learnModuleRepository.save(module));
    }
}