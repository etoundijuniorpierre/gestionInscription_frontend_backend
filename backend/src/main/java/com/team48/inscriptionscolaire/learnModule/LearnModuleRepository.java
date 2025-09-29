package com.team48.inscriptionscolaire.learnModule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearnModuleRepository extends JpaRepository<LearnModule, Integer> {
    List<LearnModule> findByProgramId(Integer programId);
    List<LearnModule> findByProgramIdOrderByModuleOrder(Integer programId);
}