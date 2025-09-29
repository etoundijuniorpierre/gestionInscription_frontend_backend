package com.team48.inscriptionscolaire.learnModule;

import com.team48.inscriptionscolaire.program.Program;

public class LearnModuleMapper {
    
    public static LearnModule toEntity(LearnModuleDTO dto, Program program) {
        return LearnModule.builder()
                .id(dto.getId())
                .moduleName(dto.getModuleName())
                .moduleDescription(dto.getModuleDescription())
                .moduleOrder(dto.getModuleOrder())
                .program(program)
                .build();
    }
    
    public static LearnModuleDTO toDto(LearnModule learnModule) {
        LearnModuleDTO dto = new LearnModuleDTO();
        dto.setId(learnModule.getId());
        dto.setModuleName(learnModule.getModuleName());
        dto.setModuleDescription(learnModule.getModuleDescription());
        dto.setModuleOrder(learnModule.getModuleOrder());
        if (learnModule.getProgram() != null) {
            dto.setProgramId(learnModule.getProgram().getId());
        }
        return dto;
    }
}