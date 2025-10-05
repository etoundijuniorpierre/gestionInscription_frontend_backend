package com.team48.inscriptionscolaire.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    
    Optional<Payment> findBySessionId(String sessionId);
    
    @Query("SELECT p FROM Payment p ORDER BY p.paymentDate DESC")
    List<Payment> findLastPayment();
    
    @Query("SELECT p FROM Payment p WHERE p.enrollment.student.id = :studentId ORDER BY p.paymentDate DESC")
    List<Payment> findByStudentId(Integer studentId);
}