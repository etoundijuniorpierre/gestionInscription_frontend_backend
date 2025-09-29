package com.team48.inscriptionscolaire.learnModule;

import lombok.Data;

@Data
public class LearnModuleDTO {
    private Integer id;
    private String moduleName;
    private String moduleDescription;
    private int moduleOrder;
    private Integer programId;
}