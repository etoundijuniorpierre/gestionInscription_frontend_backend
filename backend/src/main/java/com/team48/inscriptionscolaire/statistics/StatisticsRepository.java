package com.team48.inscriptionscolaire.statistics;

import com.team48.inscriptionscolaire.document.Document;
import com.team48.inscriptionscolaire.enrollment.Enrollment;
import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.payment.Payment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StatisticsRepository extends CrudRepository<User, Integer> {
    
    // Method to get total enrollments count
    @Query("SELECT COUNT(e) FROM Enrollment e")
    Long getTotalEnrollments();
    
    // Method to get validated enrollments count (APPROVED status)
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.status = com.team48.inscriptionscolaire.enrollment.StatusSubmission.APPROVED")
    Long getValidatedEnrollments();
    
    // Method to get pending enrollments count (various pending statuses)
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.status IN (com.team48.inscriptionscolaire.enrollment.StatusSubmission.SUBMITTED, com.team48.inscriptionscolaire.enrollment.StatusSubmission.IN_PROGRESS, com.team48.inscriptionscolaire.enrollment.StatusSubmission.PENDING, com.team48.inscriptionscolaire.enrollment.StatusSubmission.DOCUMENTS_UNDER_REVIEW)")
    Long getPendingEnrollments();
    
    // Method to get new accounts in the last 24 hours
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdDate >= :since")
    Long getNewAccountsSince(@Param("since") LocalDateTime since);
    
    // Method to get the last validated document
    @Query("SELECT d FROM Document d WHERE d.validationStatus = com.team48.inscriptionscolaire.document.ValidationStatus.APPROVED ORDER BY d.validationDate DESC")
    List<Document> getLastValidatedDocument();
    
    // Method to get the last enrollment
    @Query("SELECT e FROM Enrollment e ORDER BY e.submissionDate DESC")
    List<Enrollment> getLastEnrollment();
    
    // Method to get all users
    @Query("SELECT u FROM User u")
    List<User> getAllUsers();
    
    // Method to get the last payment
    @Query("SELECT p FROM Payment p ORDER BY p.paymentDate DESC")
    List<Payment> getLastPayment();
}