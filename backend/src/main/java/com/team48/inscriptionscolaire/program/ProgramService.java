package com.team48.inscriptionscolaire.program;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgramService {

    private final ProgramRepository programRepository;

    public Program createProgram(ProgramRequestDTO dto) {
        if (programRepository.existsByProgramCode(dto.getProgramCode())) {
            throw new IllegalArgumentException("Program code already exists");
        }
        Program program = ProgramMapper.toEntity(dto);
        
        if (dto.getLearnModules() != null) {
        }
        
        return programRepository.save(program);
    }

    public Program getProgramByCode(String programCode) {
        return programRepository.findByProgramCode(programCode)
                .orElseThrow(() -> new RuntimeException("Program not found with code: " + programCode));
    }

    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    public Program getProgramById(Integer id) {
        return programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));
    }

    @Transactional
    public Program updateProgram(Integer id, ProgramRequestDTO dto) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        program.setProgramName(dto.getProgramName());
        program.setProgramCode(dto.getProgramCode());
        program.setDescription(dto.getDescription());
        program.setRegistrationFee(dto.getRegistrationFee());
        program.setMaxCapacity(dto.getMaxCapacity());
        program.setRegistrationStartDate(dto.getRegistrationStartDate());
        program.setRegistrationEndDate(dto.getRegistrationEndDate());
        program.setDuration(dto.getDuration());
        program.setPrice(dto.getPrice());

        return programRepository.save(program);
    }

    public void deleteProgram(Integer id) {
        if (!programRepository.existsById(id)) {
            throw new RuntimeException("Program not found");
        }
        programRepository.deleteById(id);
    }
}