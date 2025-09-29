package com.team48.inscriptionscolaire.program;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgramService {

    private final ProgramRepository programRepository;

    public ProgramResponseDTO createProgram(ProgramRequestDTO dto) {
        if (programRepository.existsByProgramCode(dto.getProgramCode())) {
            throw new IllegalArgumentException("Program code already exists");
        }
        Program program = ProgramMapper.toEntity(dto);
        
        // Handle learn modules if provided
        if (dto.getLearnModules() != null) {
            // For now, we're not implementing learn module creation in this method
            // This would be extended in a more complete implementation
        }
        
        return ProgramMapper.toDto(programRepository.save(program));
    }

    public ProgramResponseDTO getProgramByCode(String programCode) {
        return programRepository.findByProgramCode(programCode)
                .map(ProgramMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Program not found with code: " + programCode));
    }

    public List<ProgramResponseDTO> getAllPrograms() {
        return programRepository.findAll().stream()
                .map(ProgramMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProgramResponseDTO getProgramById(Integer id) {
        return programRepository.findById(id)
                .map(ProgramMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Program not found"));
    }

    @Transactional
    public ProgramResponseDTO updateProgram(Integer id, ProgramRequestDTO dto) {
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

        return ProgramMapper.toDto(program);
    }

    public void deleteProgram(Integer id) {
        if (!programRepository.existsById(id)) {
            throw new RuntimeException("Program not found");
        }
        programRepository.deleteById(id);
    }
}