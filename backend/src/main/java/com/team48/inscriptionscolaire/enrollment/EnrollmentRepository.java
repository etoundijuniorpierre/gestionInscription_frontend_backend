package com.team48.inscriptionscolaire.enrollment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {

    Optional<Enrollment> findById(Integer id);
    List<Enrollment> findByStudentId(Integer studentId);
    List<Enrollment> findByProgramId(Integer programId);
    List<Enrollment> findByAcademicYear(String academicYear);
    List<Enrollment> findByProgramIdAndAcademicYear(Integer programId, String academicYear);

    // Finds a specific enrollment for a student, program, and academic year.
    Optional<Enrollment> findByStudentIdAndProgramIdAndAcademicYear(
            Integer studentId,
            Integer programId,
            String academicYear
    );

    Optional<Enrollment> findTopByStudentIdOrderByCreatedDateDesc(Integer studentId);

    // Custom query to find a student's enrollment status based on their ID.
    @Query("SELECT e.status FROM Enrollment e WHERE e.student.id = :studentId")
    Optional<StatusSubmission> findStatusByStudentId(@Param("studentId") Integer studentId);

}