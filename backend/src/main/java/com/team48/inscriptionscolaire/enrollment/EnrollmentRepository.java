package com.team48.inscriptionscolaire.enrollment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {

    Optional<Enrollment> findById(Integer id);

    List<Enrollment> findByStudentId(Integer studentId);

    List<Enrollment> findByProgramId(Integer programId);

    // Get all enrollments
    List<Enrollment> findAll();

    // Get enrollments by status
    List<Enrollment> findByStatus(StatusSubmission status);

    // Get all non-approved enrollments (not approved)
    @Query("SELECT e FROM Enrollment e WHERE e.status != com.team48.inscriptionscolaire.enrollment.StatusSubmission.APPROVED AND e.status != com.team48.inscriptionscolaire.enrollment.StatusSubmission.REJECTED")
    List<Enrollment> findAllNonApproved();

    // Finds a specific enrollment for a student and program.
    Optional<Enrollment> findByStudentIdAndProgramId(
            Integer studentId,
            Integer programId
    );

    Optional<Enrollment> findTopByStudentIdOrderByCreatedDateDesc(Integer studentId);

    // Custom query to find a student's enrollment status based on their ID.
    Optional<StatusSubmission> findStatusByStudentId(@Param("studentId") Integer studentId);

    // Check if student has enrollments with programs that start on the same date
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.student.id = :studentId AND e.program.startDate = :startDate AND e.status IN (com.team48.inscriptionscolaire.enrollment.StatusSubmission.SUBMITTED, com.team48.inscriptionscolaire.enrollment.StatusSubmission.PENDING_PAYMENT, com.team48.inscriptionscolaire.enrollment.StatusSubmission.PENDING_VALIDATION, com.team48.inscriptionscolaire.enrollment.StatusSubmission.APPROVED)")
    long countByStudentIdAndProgramStartDate(@Param("studentId") Integer studentId, @Param("startDate") LocalDate startDate);
}