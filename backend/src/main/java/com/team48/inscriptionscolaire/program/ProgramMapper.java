package com.team48.inscriptionscolaire.program;

import com.team48.inscriptionscolaire.learnModule.LearnModule;

import java.time.LocalDate;
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

    /**
     * Create program response DTO with proper enrollment status calculation
     *
     * @param program The program entity to convert
     * @return ProgramResponseDTO with calculated enrollment status
     */
    public static ProgramResponseDTO toDtoWithEnrollmentStatus(Program program) {
        ProgramResponseDTO dto = toDto(program);

        // Override enrollment status with proper logic
        // For now, use the basic logic, but this should be enhanced to check for student conflicts
        dto.setEnrollmentOpen(calculateEnrollmentStatus(program));

        return dto;
    }

    /**
     * Calculate if enrollment is open considering business rules
     *
     * @param program The program to check enrollment status for
     * @return true if enrollment is open, false otherwise
     */
    private static boolean calculateEnrollmentStatus(Program program) {
        // 1. Check if enrollment period is open (basic check)
        LocalDate today = LocalDate.now();
        boolean isInEnrollmentPeriod = program.getRegistrationStartDate() != null &&
                program.getRegistrationEndDate() != null &&
                !today.isBefore(program.getRegistrationStartDate()) &&
                !today.isAfter(program.getRegistrationEndDate());

        if (!isInEnrollmentPeriod) {
            return false;
        }

        // TODO: 2. Check for schedule conflicts (requires student context)
        // TODO: 3. Check admin overrides
        // TODO: 4. Check capacity limits

        // For now, return the period-based status
        return true;
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