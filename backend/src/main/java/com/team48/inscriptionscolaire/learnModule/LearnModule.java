package com.team48.inscriptionscolaire.learnModule;

import com.team48.inscriptionscolaire.user.BaseEntity;
import com.team48.inscriptionscolaire.program.Program;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class LearnModule extends BaseEntity {
    @Column(length = 200)
    private String moduleName;
    
    @Column(columnDefinition = "TEXT")
    private String moduleDescription;
    
    @Column(nullable = false)
    private int moduleOrder;
    
    @ManyToOne
    private Program program;
}