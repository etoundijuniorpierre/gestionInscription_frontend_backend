package com.team48.inscriptionscolaire.statistics;

import com.team48.inscriptionscolaire.document.Document;
import com.team48.inscriptionscolaire.document.DocumentRepository;
import com.team48.inscriptionscolaire.enrollment.Enrollment;
import com.team48.inscriptionscolaire.enrollment.EnrollmentRepository;
import com.team48.inscriptionscolaire.enrollment.StatusSubmission;
import com.team48.inscriptionscolaire.payment.Payment;
import com.team48.inscriptionscolaire.payment.PaymentRepository;
import com.team48.inscriptionscolaire.payment.PaymentType;
import com.team48.inscriptionscolaire.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final StatisticsRepository statisticsRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

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
        List<Payment> lastPayments = paymentRepository.findLastPayment();
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

    public Map<String, Object> getAllStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Candidature statistics
        stats.put("candidatures", getCandidatureStatistics());

        // Inscription statistics
        stats.put("inscriptions", getInscriptionStatistics());

        // New accounts (24h)
        stats.put("nouveauxComptes", getNouveauxComptes());

        // Enrollments by program
        stats.put("inscriptionsParFormation", getInscriptionsParFormation());

        // Real-time statistics
        stats.put("tempsReel", getTempsReelStatistics());

        return stats;
    }

    public Map<String, Object> getCandidatureStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Total candidatures (tous les statuts sauf DRAFT)
        long candidaturesTotales = enrollmentRepository.count();
        stats.put("total", candidaturesTotales);

        // Candidatures pending payment
        long enAttentePaiement = statisticsRepository.getEnrollmentsByStatus(StatusSubmission.PENDING_PAYMENT);
        stats.put("enAttenteDePaiement", enAttentePaiement);

        // Candidatures pending validation
        long enAttenteValidation = statisticsRepository.getEnrollmentsByStatus(StatusSubmission.PENDING_VALIDATION);
        stats.put("enAttenteDeValidation", enAttenteValidation);

        // Distribution by status using database query instead of loading all entities
        Map<String, Long> statutDistribution = new HashMap<>();
        for (StatusSubmission status : StatusSubmission.values()) {
            if (status != StatusSubmission.DRAFT) {
                statutDistribution.put(status.toString(), statisticsRepository.getEnrollmentsByStatus(status));
            }
        }
        stats.put("statuts", statutDistribution);

        return stats;
    }

    public Map<String, Object> getInscriptionStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Total inscriptions = completed program payments
        long inscriptionsTotales = statisticsRepository.getPaymentsByStatusAndType("SUCCESSFUL", PaymentType.PROGRAM_PAYMENT);
        stats.put("total", inscriptionsTotales);

        // Inscriptions pending payment (approved candidatures but program not paid)
        long approvedEnrollmentsCount = statisticsRepository.getEnrollmentsByStatus(StatusSubmission.APPROVED);
        long completedProgramPaymentsCount = statisticsRepository.getPaymentsByStatusAndType("SUCCESSFUL", PaymentType.PROGRAM_PAYMENT);
        long enAttentePaiementInscription = approvedEnrollmentsCount - completedProgramPaymentsCount;
        stats.put("enAttenteDePaiement", Math.max(0, enAttentePaiementInscription));

        return stats;
    }

    public Map<String, Object> getNouveauxComptes() {
        Map<String, Object> stats = new HashMap<>();

        long nouveauxEtudiants = statisticsRepository.getNewAccountsSince(LocalDateTime.now().minusHours(24));
        stats.put("dernières24h", nouveauxEtudiants);

        return stats;
    }

    public Map<String, Object> getInscriptionsParFormation() {
        Map<String, Object> stats = new HashMap<>();

        // Using a custom query to get enrollments by program directly from database
        List<Object[]> results = paymentRepository.findCompletedProgramPaymentsGroupedByProgram();

        Map<String, Long> parFormation = new HashMap<>();
        for (Object[] result : results) {
            String programName = (String) result[0];
            Long count = (Long) result[1];
            parFormation.put(programName, count);
        }

        stats.put("parFormation", parFormation);

        return stats;
    }

    public Map<String, Object> getTempsReelStatistics() {
        Map<String, Object> stats = new HashMap<>();

        LocalDateTime depuis24h = LocalDateTime.now().minusHours(24);

        // New payments (all types)
        long nouveauxPaiements = statisticsRepository.getPaymentsSince(depuis24h);
        stats.put("nouveauxPaiements", nouveauxPaiements);

        // New enrollments (paid programs) in last 24 hours
        long nouvellesInscriptions = paymentRepository.findByStatusAndPaymentTypeAndCreatedDateAfter("SUCCESSFUL", PaymentType.PROGRAM_PAYMENT, depuis24h).size();
        stats.put("nouvellesInscriptions", nouvellesInscriptions);

        // New candidatures (created enrollments) in last 24 hours
        long nouvellesCandidatures = statisticsRepository.getEnrollmentsSince(depuis24h);
        stats.put("nouvellesCandidatures", nouvellesCandidatures);

        return stats;
    }

    public Map<String, Object> getStatisticsByType(String type) {
        switch (type.toLowerCase()) {
            case "candidatures":
                return getCandidatureStatistics();
            case "inscriptions":
                return getInscriptionStatistics();
            case "nouveauxcomptes":
                return getNouveauxComptes();
            case "parformation":
                return getInscriptionsParFormation();
            case "tempsreel":
                return getTempsReelStatistics();
            default:
                return getAllStatistics();
        }
    }
}