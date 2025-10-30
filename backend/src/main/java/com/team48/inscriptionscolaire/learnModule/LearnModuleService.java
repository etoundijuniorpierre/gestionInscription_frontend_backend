package com.team48.inscriptionscolaire.learnModule;

import com.team48.inscriptionscolaire.program.Program;
import com.team48.inscriptionscolaire.program.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LearnModuleService {

    private final LearnModuleRepository learnModuleRepository;
    private final ProgramRepository programRepository;

    public LearnModule createModule(LearnModuleDTO dto) {
        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + dto.getProgramId()));

        LearnModule module = LearnModuleMapper.toEntity(dto, program);
        return learnModuleRepository.save(module);
    }

    public LearnModule getModuleById(Integer id) {
        return learnModuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learn module not found with id: " + id));
    }

    public List<LearnModule> getModulesByProgramId(Integer programId) {
        return learnModuleRepository.findByProgramIdOrderByModuleOrder(programId);
    }

    public LearnModule updateModule(Integer id, LearnModuleDTO dto) {
        LearnModule existingModule = learnModuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learn module not found with id: " + id));

        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + dto.getProgramId()));

        existingModule.setModuleName(dto.getModuleName());
        existingModule.setModuleDescription(dto.getModuleDescription());
        existingModule.setModuleOrder(dto.getModuleOrder());
        existingModule.setProgram(program);

        return learnModuleRepository.save(existingModule);
    }

    public void deleteModule(Integer id) {
        if (!learnModuleRepository.existsById(id)) {
            throw new RuntimeException("Learn module not found with id: " + id);
        }
        learnModuleRepository.deleteById(id);
    }

    public LearnModule addModuleToProgram(Integer programId, LearnModuleDTO dto) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + programId));

        dto.setProgramId(programId);
        LearnModule module = LearnModuleMapper.toEntity(dto, program);
        return learnModuleRepository.save(module);
    }
}