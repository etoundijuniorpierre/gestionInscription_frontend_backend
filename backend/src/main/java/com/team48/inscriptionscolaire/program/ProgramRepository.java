package com.team48.inscriptionscolaire.program;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgramRepository extends JpaRepository<Program, Integer> {
    boolean existsByProgramCode(String code);

    Optional<Program> findByProgramCode(String programCode);
}
