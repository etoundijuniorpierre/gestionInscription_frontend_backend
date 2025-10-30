package com.team48.inscriptionscolaire.statistics;

import com.team48.inscriptionscolaire.document.Document;
import com.team48.inscriptionscolaire.enrollment.Enrollment;
import com.team48.inscriptionscolaire.enrollment.StatusSubmission;
import com.team48.inscriptionscolaire.payment.PaymentType;
import com.team48.inscriptionscolaire.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StatisticsRepository extends JpaRepository<Statistics, Integer> {

    // Method to get total enrollments count
    @Query("SELECT COUNT(e) FROM Enrollment e")
    Long getTotalEnrollments();

    // Method to get validated enrollments count (APPROVED status)
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.status = StatusSubmission.APPROVED")
    Long getValidatedEnrollments();

    // Method to get pending enrollments count (various pending statuses)
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.status IN (StatusSubmission.SUBMITTED, StatusSubmission.PENDING_PAYMENT, StatusSubmission.PENDING_VALIDATION)")
    Long getPendingEnrollments();

    // Method to get new accounts in the last 24 hours
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdDate >= :since")
    Long getNewAccountsSince(@Param("since") LocalDateTime since);

    // Method to get the last validated document
    @Query("SELECT d FROM Document d WHERE d.validationStatus = ValidationStatus.VALIDATED ORDER BY d.validationDate DESC")
    List<Document> getLastValidatedDocument();

    // Method to get the last enrollment
    @Query("SELECT e FROM Enrollment e ORDER BY e.submissionDate DESC")
    List<Enrollment> getLastEnrollment();

    // Method to get all users
    @Query("SELECT u FROM User u")
    List<User> getAllUsers();

    // Get enrollments by status
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.status = :status")
    Long getEnrollmentsByStatus(@Param("status") StatusSubmission status);

    // Get payments by status and type
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status AND p.paymentType = :paymentType")
    Long getPaymentsByStatusAndType(@Param("status") String status, @Param("paymentType") PaymentType paymentType);

    // Get payments in last 24 hours
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.createdDate >= :since")
    Long getPaymentsSince(@Param("since") LocalDateTime since);

    // Get enrollments in last 24 hours
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.createdDate >= :since")
    Long getEnrollmentsSince(@Param("since") LocalDateTime since);
}