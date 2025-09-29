package com.team48.inscriptionscolaire.statistics;

import com.team48.inscriptionscolaire.document.Document;
import com.team48.inscriptionscolaire.enrollment.Enrollment;
import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.payment.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    
    private final StatisticsRepository statisticsRepository;
    private final com.team48.inscriptionscolaire.enrollment.EnrollmentRepository enrollmentRepository;
    private final com.team48.inscriptionscolaire.document.DocumentRepository documentRepository;
    private final com.team48.inscriptionscolaire.user.UserRepository userRepository;
    private final com.team48.inscriptionscolaire.payment.PaymentRepository paymentRepository;
    
    public StatisticsDto getStatistics() {
        StatisticsDto stats = new StatisticsDto();
        
        // Static statistics
        stats.setTotalEnrollments(statisticsRepository.getTotalEnrollments());
        stats.setValidatedEnrollments(statisticsRepository.getValidatedEnrollments());
        stats.setPendingEnrollments(statisticsRepository.getPendingEnrollments());
        stats.setNewAccountsLast24h(statisticsRepository.getNewAccountsSince(LocalDateTime.now().minusDays(1)));
        
        // Real-time statistics (simplified for now)
        stats.setConnectedAccounts((long) statisticsRepository.getAllUsers().size());
        
        // Last validated document
        List<Document> lastDocuments = statisticsRepository.getLastValidatedDocument();
        if (!lastDocuments.isEmpty()) {
            Document lastDoc = lastDocuments.get(0);
            LastDocumentDto docDto = new LastDocumentDto();
            docDto.setId(lastDoc.getId());
            docDto.setName(lastDoc.getName());
            docDto.setDocumentType(lastDoc.getDocumentType());
            docDto.setValidationDate(lastDoc.getValidationDate());
            
            // Get student and program names if available
            if (lastDoc.getEnrollment() != null) {
                Enrollment enrollment = lastDoc.getEnrollment();
                if (enrollment.getStudent() != null) {
                    docDto.setStudentName(enrollment.getStudent().getFirstname() + " " + enrollment.getStudent().getLastname());
                }
                if (enrollment.getProgram() != null) {
                    docDto.setProgramName(enrollment.getProgram().getProgramName());
                }
            }
            
            stats.setLastValidatedDocument(docDto);
        }
        
        // Last enrollment
        List<Enrollment> lastEnrollments = statisticsRepository.getLastEnrollment();
        if (!lastEnrollments.isEmpty()) {
            Enrollment lastEnroll = lastEnrollments.get(0);
            LastEnrollmentDto enrollDto = new LastEnrollmentDto();
            enrollDto.setId(lastEnroll.getId());
            
            // Get student and program names if available
            if (lastEnroll.getStudent() != null) {
                enrollDto.setStudentName(lastEnroll.getStudent().getFirstname() + " " + lastEnroll.getStudent().getLastname());
            }
            if (lastEnroll.getProgram() != null) {
                enrollDto.setProgramName(lastEnroll.getProgram().getProgramName());
            }
            
            enrollDto.setSubmissionDate(lastEnroll.getSubmissionDate());
            enrollDto.setStatus(lastEnroll.getStatus().name());
            stats.setLastEnrollment(enrollDto);
        }
        
        // Last payment
        List<Payment> lastPayments = statisticsRepository.getLastPayment();
        if (!lastPayments.isEmpty()) {
            Payment lastPayment = lastPayments.get(0);
            LastPaymentDto paymentDto = new LastPaymentDto();
            paymentDto.setSessionId(lastPayment.getSessionId());
            paymentDto.setAmount(lastPayment.getAmount());
            paymentDto.setCurrency(lastPayment.getCurrency());
            paymentDto.setPaymentDate(lastPayment.getPaymentDate());
            paymentDto.setEnrollmentId(lastPayment.getEnrollment().getId());
            
            // Get student name if available
            if (lastPayment.getEnrollment() != null && lastPayment.getEnrollment().getStudent() != null) {
                paymentDto.setStudentName(lastPayment.getEnrollment().getStudent().getFirstname() + " " + lastPayment.getEnrollment().getStudent().getLastname());
            }
            
            stats.setLastPayment(paymentDto);
        }
        
        return stats;
    }
}