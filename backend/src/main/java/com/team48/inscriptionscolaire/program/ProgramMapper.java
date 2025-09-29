package com.team48.inscriptionscolaire.program;

import com.team48.inscriptionscolaire.learnModule.LearnModule;

import java.util.List;
import java.util.stream.Collectors;

public class ProgramMapper {

    public static Program toEntity(ProgramRequestDTO dto) {
        return Program.builder()
                .programName(dto.getProgramName())
                .programCode(dto.getProgramCode())
                .description(dto.getDescription())
                .registrationFee(dto.getRegistrationFee())
                .maxCapacity(dto.getMaxCapacity())
                .registrationStartDate(dto.getRegistrationStartDate())
                .registrationEndDate(dto.getRegistrationEndDate())
                .duration(dto.getDuration())
                .price(dto.getPrice())
                .build();
    }

    public static ProgramResponseDTO toDto(Program program) {
        ProgramResponseDTO dto = new ProgramResponseDTO();
        dto.setId(program.getId());
        dto.setProgramName(program.getProgramName());
        dto.setProgramCode(program.getProgramCode());
        dto.setDescription(program.getDescription());
        dto.setRegistrationFee(program.getRegistrationFee());
        dto.setMaxCapacity(program.getMaxCapacity());
        dto.setRegistrationStartDate(program.getRegistrationStartDate());
        dto.setRegistrationEndDate(program.getRegistrationEndDate());
        dto.setDuration(program.getDuration());
        dto.setPrice(program.getPrice());
        // Set enrollment status
        dto.setEnrollmentOpen(program.isEnrollmentOpen());
        
        // Map learn modules
        if (program.getLearnModules() != null) {
            List<ProgramResponseDTO.LearnModuleDTO> learnModuleDTOs = program.getLearnModules().stream()
                    .map(module -> {
                        ProgramResponseDTO.LearnModuleDTO moduleDTO = new ProgramResponseDTO.LearnModuleDTO();
                        moduleDTO.setId(module.getId());
                        moduleDTO.setModuleName(module.getModuleName());
                        moduleDTO.setModuleDescription(module.getModuleDescription());
                        moduleDTO.setModuleOrder(module.getModuleOrder());
                        return moduleDTO;
                    })
                    .collect(Collectors.toList());
            dto.setLearnModules(learnModuleDTOs);
        }
        
        String imagePath = "/assets/images/" + program.getProgramCode() + ".png";
        dto.setImage(imagePath);
        return dto;
    }
    
    public static LearnModule toLearnModuleEntity(Program program, ProgramRequestDTO.LearnModuleDTO dto) {
        return LearnModule.builder()
                .program(program)
                .moduleName(dto.getModuleName())
                .moduleDescription(dto.getModuleDescription())
                .moduleOrder(dto.getModuleOrder())
                .build();
    }
}