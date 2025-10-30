package com.team48.inscriptionscolaire.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT p FROM Payment p ORDER BY p.paymentDate DESC")
    List<Payment> findLastPayment();

    // Find payments by status, payment type, and created after a specific date
    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.paymentType = :paymentType AND p.createdDate > :date")
    List<Payment> findByStatusAndPaymentTypeAndCreatedDateAfter(@Param("status") String status, @Param("paymentType") PaymentType paymentType, @Param("date") LocalDateTime date);

    // Find completed program payments grouped by program
    @Query("SELECT p.enrollment.program.programName, COUNT(p) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentType = com.team48.inscriptionscolaire.payment.PaymentType.PROGRAM_PAYMENT AND p.enrollment.program IS NOT NULL GROUP BY p.enrollment.program.programName")
    List<Object[]> findCompletedProgramPaymentsGroupedByProgram();

    boolean existsByEnrollmentId(Integer enrollmentId);
}