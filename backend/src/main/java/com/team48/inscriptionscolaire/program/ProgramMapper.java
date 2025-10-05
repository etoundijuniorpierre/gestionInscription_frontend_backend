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
                .certificateName(dto.getCertificateName())
                .careerProspects(dto.getCareerProspects())
                .registrationFee(dto.getRegistrationFee())
                .maxCapacity(dto.getMaxCapacity())
                .registrationStartDate(dto.getRegistrationStartDate())
                .registrationEndDate(dto.getRegistrationEndDate())
                .duration(dto.getDuration())
                .price(dto.getPrice())
                .startDate(dto.getStartDate())
                .hoursPerDay(dto.getHoursPerDay())
                .daysPerWeek(dto.getDaysPerWeek())
                .courseDays(dto.getCourseDays())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .build();
    }

    public static ProgramResponseDTO toDto(Program program) {
        ProgramResponseDTO dto = new ProgramResponseDTO();
        dto.setId(program.getId());
        dto.setProgramName(program.getProgramName());
        dto.setProgramCode(program.getProgramCode());
        dto.setDescription(program.getDescription());
        dto.setCertificateName(program.getCertificateName());
        dto.setCareerProspects(program.getCareerProspects());
        dto.setRegistrationFee(program.getRegistrationFee());
        dto.setMaxCapacity(program.getMaxCapacity());
        dto.setRegistrationStartDate(program.getRegistrationStartDate());
        dto.setRegistrationEndDate(program.getRegistrationEndDate());
        dto.setDuration(program.getDuration());
        dto.setPrice(program.getPrice());
        dto.setStartDate(program.getStartDate());
        dto.setEndDate(program.getEndDate());
        dto.setCreatedDate(program.getCreatedDate());
        dto.setLastModifiedDate(program.getLastModifiedDate());
        // Set enrollment status
        dto.setEnrollmentOpen(program.isEnrollmentOpen());
        
        // Set schedule properties
        dto.setHoursPerDay(program.getHoursPerDay());
        dto.setDaysPerWeek(program.getDaysPerWeek());
        dto.setCourseDays(program.getCourseDays());
        dto.setStartTime(program.getStartTime());
        dto.setEndTime(program.getEndTime());
        
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