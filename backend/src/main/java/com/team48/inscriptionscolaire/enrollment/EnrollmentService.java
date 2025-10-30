package com.team48.inscriptionscolaire.enrollment;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team48.inscriptionscolaire.document.*;
import com.team48.inscriptionscolaire.email.EmailService;
import com.team48.inscriptionscolaire.notification.NotificationService;
import com.team48.inscriptionscolaire.payment.PaymentRepository;
import com.team48.inscriptionscolaire.payment.PaymentType;
import com.team48.inscriptionscolaire.program.Program;
import com.team48.inscriptionscolaire.program.ProgramRepository;
import com.team48.inscriptionscolaire.student.Student;
import com.team48.inscriptionscolaire.student.StudentStatus;
import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final ProgramRepository programRepository;
    private final UserRepository userRepository;
    private final DocumentService documentService;
    private final FileUploadConfig fileUploadConfig;
    private final ObjectMapper objectMapper;
    private final DocumentRepository documentRepository;
    private final NotificationService notificationService;
    private final PaymentRepository paymentRepository;
    private final EmailService emailService;

    @Transactional
    public Enrollment processEnrollment(EnrollmentDtoRequest dto, List<MultipartFile> documentFiles) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = (Student) user;

        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new EntityNotFoundException("Program not found"));

        // Check if enrollment is open for this program
        if (!program.isEnrollmentOpen()) {
            log.warn("Enrollment closed for program: {}", program.getProgramName());
            throw new IllegalStateException("Enrollments are not currently open for this program.");
        }

        // Check if student is already enrolled in another program with the same start date
        if (program.getStartDate() != null && hasConflictingEnrollment(student.getId(), program.getStartDate(), program.getId())) {
            log.warn("Student {} has conflicting enrollment for program: {}", student.getEmail(), program.getProgramName());
            throw new IllegalStateException("You are already enrolled in another program that starts on the same date.");
        }
        // Check for schedule conflicts
        if (hasScheduleConflict(student.getId(), program)) {
            log.warn("Student {} has schedule conflict for program: {}", student.getEmail(), program.getProgramName());
            throw new IllegalStateException("You are already enrolled in another program with conflicting schedule.");
        }

        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndProgramId(student.getId(), program.getId())
                .orElseGet(() -> {
                    Enrollment newEnrollment = new Enrollment();
                    newEnrollment.setStudent(student);
                    newEnrollment.setProgram(program);
                    newEnrollment.setStatus(StatusSubmission.PENDING_PAYMENT);
                    return newEnrollment;
                });


        updatePersonalInfo(enrollment, dto.getPersonalInfo());
        updateAcademicInfo(enrollment, dto.getAcademicInfo());
        updateContactDetails(enrollment, dto.getContactDetails());

        if (documentFiles != null && !documentFiles.isEmpty()) {
            addDocumentsToEnrollment(enrollment, documentFiles);
        }

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        log.info("Enrollment saved with ID: {}", savedEnrollment.getId());

        // Send notification to student only when enrollment is first submitted (status changes from DRAFT to SUBMITTED)
        if (savedEnrollment.getStatus() == StatusSubmission.DRAFT) {
            try {
                String studentMessage = "Votre demande d'inscription pour le programme '" +
                        program.getProgramName() +
                        "' a été enregistrée en tant que brouillon. Vous pouvez la modifier à tout moment avant de la soumettre.";
                notificationService.sendPrivateNotification(student.getUsername(), studentMessage);
                log.info("Draft enrollment notification sent successfully");
            } catch (Exception e) {
                log.error("Failed to send draft enrollment notification: {}", e.getMessage(), e);
            }
        }

        return savedEnrollment;
    }

    private boolean hasConflictingEnrollment(Integer studentId, LocalDate startDate, Integer programId) {
        return enrollmentRepository.countByStudentIdAndProgramStartDate(studentId, startDate) > 0;
    }

    private boolean hasScheduleConflict(Integer studentId, Program newProgram) {
        try {
            List<Enrollment> activeEnrollments = enrollmentRepository.findByStudentId(studentId)
                    .stream()
                    .filter(e -> e.getStatus() == StatusSubmission.SUBMITTED ||
                            e.getStatus() == StatusSubmission.PENDING_PAYMENT ||
                            e.getStatus() == StatusSubmission.PENDING_VALIDATION ||
                            e.getStatus() == StatusSubmission.APPROVED)
                    .toList();

            log.debug("Found {} active enrollments for student {}", activeEnrollments.size(), studentId);

            for (Enrollment enrollment : activeEnrollments) {
                Program existingProgram = enrollment.getProgram();

                if (existingProgram.getId().equals(newProgram.getId())) {
                    continue;
                }

                if (newProgram.getCourseDays() == null || existingProgram.getCourseDays() == null ||
                        newProgram.getStartTime() == null || existingProgram.getStartTime() == null ||
                        newProgram.getEndTime() == null || existingProgram.getEndTime() == null) {
                    log.debug("Skipping conflict check - missing schedule info for programs {} and {}",
                            newProgram.getProgramName(), existingProgram.getProgramName());
                    continue;
                }

                if (hasTimeOverlap(newProgram, existingProgram)) {
                    log.warn("Schedule conflict detected between {} and {} for student {}",
                            newProgram.getProgramName(), existingProgram.getProgramName(), studentId);
                    return true;
                }
            }

            return false;
        } catch (Exception e) {
            log.error("Error checking schedule conflicts for student {}: {}", studentId, e.getMessage(), e);
            return false;
        }
    }

    private boolean hasTimeOverlap(Program program1, Program program2) {
        try {
                boolean hasCommonDay = program1.getCourseDays().stream()
                    .anyMatch(day -> program2.getCourseDays().contains(day));

            if (!hasCommonDay) {
                return false;
            }

            LocalTime start1 = program1.getStartTime();
            LocalTime end1 = program1.getEndTime();
            LocalTime start2 = program2.getStartTime();
            LocalTime end2 = program2.getEndTime();

            return start1.isBefore(end2) && start2.isBefore(end1);
        } catch (Exception e) {
            log.error("Error checking time overlap between {} and {}: {}",
                    program1.getProgramName(), program2.getProgramName(), e.getMessage(), e);
            return false;
        }
    }

    @Transactional
    public void completeEnrollment(Enrollment enrollment) {
        if (enrollment.getPersonalInfo() == null ||
                enrollment.getAcademicInfo() == null ||
                enrollment.getContactDetails() == null) {
            throw new IllegalStateException("All required information must be provided before final submission.");
        }

        if (enrollment.getDocuments() == null ||
                !enrollment.getDocuments().stream().anyMatch(doc -> "diplome1".equals(doc.getDocumentType())) ||
                !enrollment.getDocuments().stream().anyMatch(doc -> "cni".equals(doc.getDocumentType())) ||
                !enrollment.getDocuments().stream().anyMatch(doc -> "acteNaissance".equals(doc.getDocumentType())) ||
                !enrollment.getDocuments().stream().anyMatch(doc -> "photoIdentite".equals(doc.getDocumentType())) ||
                !enrollment.getDocuments().stream().anyMatch(doc -> "cv".equals(doc.getDocumentType())) ||
                !enrollment.getDocuments().stream().anyMatch(doc -> "lettreMotivation".equals(doc.getDocumentType()))
        ) {
            throw new IllegalStateException("All required documents must be uploaded before final submission.");
        }

        enrollment.setStatus(StatusSubmission.SUBMITTED);
    }

    private void addDocumentsToEnrollment(Enrollment enrollment, List<MultipartFile> documentFiles) {
        try {
            List<Document> newDocuments = new ArrayList<>();
            for (MultipartFile file : documentFiles) {
                validateFile(file);
                Document document = documentService.saveDocument(file);
                document.setEnrollment(enrollment);
                String documentName = file.getOriginalFilename();
                if (documentName != null && documentName.contains(".")) {
                    document.setDocumentType(FilenameUtils.getBaseName(documentName));
                }
                document.setValidationStatus(ValidationStatus.PENDING);
                newDocuments.add(document);
            }
            if (enrollment.getDocuments() == null) {
                enrollment.setDocuments(new ArrayList<>());
            }
            enrollment.getDocuments().clear();
            enrollment.getDocuments().addAll(newDocuments);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload documents", e);
        }
    }

    public EnrollmentDtoRequest parseEnrollmentJson(String enrollmentJson) throws JsonProcessingException {
        return objectMapper.readValue(enrollmentJson, EnrollmentDtoRequest.class);
    }

    private void updatePersonalInfo(Enrollment enrollment, PersonalInfoDto personalInfoDto) {
        if (personalInfoDto == null) {
            personalInfoDto = new PersonalInfoDto();
        }

        PersonalInfo personalInfo = enrollment.getPersonalInfo() != null ? enrollment.getPersonalInfo() : new PersonalInfo();

        if (personalInfoDto.getFirstName() == null || personalInfoDto.getFirstName().isEmpty()) {
            if (enrollment.getStudent() != null && enrollment.getStudent().getFirstname() != null) {
                personalInfoDto.setFirstName(enrollment.getStudent().getFirstname());
            }
        }

        if (personalInfoDto.getLastName() == null || personalInfoDto.getLastName().isEmpty()) {
            if (enrollment.getStudent() != null && enrollment.getStudent().getLastname() != null) {
                personalInfoDto.setLastName(enrollment.getStudent().getLastname());
            }
        }

        personalInfo.setFirstName(personalInfoDto.getFirstName());
        personalInfo.setLastName(personalInfoDto.getLastName());
        personalInfo.setNationality(personalInfoDto.getNationality());
        personalInfo.setGender(personalInfoDto.getGender());
        personalInfo.setDateOfBirth(personalInfoDto.getDateOfBirth());
        enrollment.setPersonalInfo(personalInfo);
    }

    private void updateAcademicInfo(Enrollment enrollment, AcademicInfoDto academicInfoDto) {
        if (academicInfoDto == null) {
            return;
        }
        AcademicInfo academicInfo = enrollment.getAcademicInfo() != null ? enrollment.getAcademicInfo() : new AcademicInfo();
        academicInfo.setLastInstitution(academicInfoDto.getLastInstitution());
        academicInfo.setSpecialization(academicInfoDto.getSpecialization());
        academicInfo.setAvailableForInternship(academicInfoDto.getAvailableForInternship());
        academicInfo.setStartDate(academicInfoDto.getStartDate());
        academicInfo.setEndDate(academicInfoDto.getEndDate());
        academicInfo.setDiplomaObtained(academicInfoDto.getDiplomaObtained());
        enrollment.setAcademicInfo(academicInfo);
    }

    private void updateContactDetails(Enrollment enrollment, ContactDetailsDto contactDetailsDto) {
        if (contactDetailsDto == null) {
            return;
        }
        ContactDetails contactDetails = enrollment.getContactDetails() != null ? enrollment.getContactDetails() : new ContactDetails();
        contactDetails.setEmail(contactDetailsDto.getEmail());
        contactDetails.setPhoneNumber(contactDetailsDto.getPhoneNumber());
        contactDetails.setCountryCode(contactDetailsDto.getCountryCode());
        contactDetails.setCountry(contactDetailsDto.getCountry());
        contactDetails.setRegion(contactDetailsDto.getRegion());
        contactDetails.setCity(contactDetailsDto.getCity());
        contactDetails.setAddress(contactDetailsDto.getAddress());

        if (contactDetailsDto.getEmergencyContacts() != null) {
            List<EmergencyContact> emergencyContacts = contactDetailsDto.getEmergencyContacts().stream()
                    .map(this::mapEmergencyContactDtoToEntity)
                    .collect(Collectors.toList());
            contactDetails.setEmergencyContacts(emergencyContacts);
        } else {
            contactDetails.setEmergencyContacts(new ArrayList<>());
        }

        enrollment.setContactDetails(contactDetails);
    }

    private EmergencyContact mapEmergencyContactDtoToEntity(EmergencyContactDto dto) {
        EmergencyContact entity = new EmergencyContact();
        entity.setName(dto.getName());
        entity.setPhone(dto.getPhone());
        entity.setCountryCode(dto.getCountryCode());
        entity.setRelationship(dto.getRelationship());
        return entity;
    }

    private void validateFile(MultipartFile file) {
        if (file.getContentType() == null || !fileUploadConfig.getAllowedFileTypes().contains(file.getContentType())) {
            throw new IllegalArgumentException(
                    "Unauthorized file type. Allowed types: " +
                            String.join(", ", fileUploadConfig.getAllowedFileTypes())
            );
        }
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        if (extension == null || !fileUploadConfig.getAllowedExtensions().contains(extension.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Unauthorized file extension. Allowed extensions: " +
                            String.join(", ", fileUploadConfig.getAllowedExtensions())
            );
        }
    }

    public Enrollment getEnrollmentById(Integer enrollmentId) {
        return enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found with id: " + enrollmentId));
    }

    public List<Enrollment> getMyEnrollments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = (Student) user;
        return enrollmentRepository.findByStudentId(student.getId())
                .stream()
                .filter(enrollment -> enrollment.getStatus() != StatusSubmission.CANCELLED)
                .collect(Collectors.toList());
    }

    public List<Enrollment> getEnrollmentsByProgram(Integer programId) {
        return enrollmentRepository.findByProgramId(programId);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getAllNonApprovedEnrollments() {
        return enrollmentRepository.findAllNonApproved();
    }

    public List<Enrollment> getAllPaidEnrollmentsPendingValidation() {
        return enrollmentRepository.findByStatus(StatusSubmission.PENDING_VALIDATION);
    }

    public List<Enrollment> getAllPendingPaymentEnrollments() {
        return enrollmentRepository.findByStatus(StatusSubmission.PENDING_PAYMENT);
    }

    public List<Enrollment> getMyUnpaidEnrollments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = (Student) user;

        return enrollmentRepository.findByStudentId(student.getId())
                .stream()
                .filter(enrollment -> enrollment.getStatus() == StatusSubmission.PENDING_PAYMENT ||
                        enrollment.getStatus() == StatusSubmission.PENDING_PROGRAM_PAYMENT)
                .collect(Collectors.toList());
    }

    public List<Program> getMyUnpaidPrograms() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = (Student) user;

        return enrollmentRepository.findByStudentId(student.getId())
                .stream()
                .filter(enrollment -> enrollment.getStatus() == StatusSubmission.PENDING_PAYMENT ||
                        enrollment.getStatus() == StatusSubmission.PENDING_PROGRAM_PAYMENT)
                .map(Enrollment::getProgram)
                .collect(Collectors.toList());
    }

    @Transactional
    public Enrollment approveEnrollment(Integer enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        if (enrollment.getPayment() == null || !"SUCCESSFUL".equals(enrollment.getPayment().getStatus())) {
            throw new IllegalStateException("Enrollment payment must be completed before approval.");
        }

        enrollment.getDocuments().forEach(doc -> doc.setValidationStatus(ValidationStatus.VALIDATED));

        enrollment.setStatus(StatusSubmission.PENDING_PROGRAM_PAYMENT);
        enrollment.setValidationDate(LocalDateTime.now());
        enrollmentRepository.save(enrollment);

        String message = "Congratulations! Your enrollment application for the program '"
                + enrollment.getProgram().getProgramName()
                + "' has been approved. You can now proceed to pay for the program.";

        notificationService.sendPrivateNotification(enrollment.getStudent().getUsername(), message);
        return enrollment;
    }

    @Transactional
    public Enrollment requestCorrections(Integer enrollmentId, List<DocumentCorrectionDto> corrections) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        enrollment.setStatus(StatusSubmission.CORRECTIONS_REQUIRED);
        enrollmentRepository.save(enrollment);

        if (corrections != null && !corrections.isEmpty()) {
            corrections.forEach(correction -> documentRepository.findById(correction.getDocumentId())
                    .ifPresent(doc -> {
                        doc.setRejectionReason(correction.getReason());
                        doc.setValidationStatus(ValidationStatus.REJECTED);
                        documentRepository.save(doc);
                    }));
        }

        String message = "Votre demande d'inscription nécessite des corrections. Veuillez consulter votre tableau de bord pour mettre à jour les documents requis.";
        notificationService.sendPrivateNotification(enrollment.getStudent().getUsername(), message);

        return enrollment;
    }

    @Transactional
    public Enrollment rejectEnrollment(Integer enrollmentId, String rejectionReason) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        if (enrollment.getPayment() == null || !"SUCCESSFUL".equals(enrollment.getPayment().getStatus())) {
            throw new IllegalStateException("Enrollment payment must be completed before rejection.");
        }

        enrollment.setStatus(StatusSubmission.REJECTED);
        enrollment.setRejectionReason(rejectionReason);
        enrollmentRepository.save(enrollment);

        String notificationMessage = "Votre demande d'inscription a été rejetée. Veuillez consulter votre email pour connaître la raison du rejet.";
        notificationService.sendPrivateNotification(enrollment.getStudent().getUsername(), notificationMessage);

        try {
            String studentName = enrollment.getStudent().getFirstname() + " " + enrollment.getStudent().getLastname();
            String programName = enrollment.getProgram().getProgramName();
            emailService.sendEnrollmentRejectionEmail(
                    enrollment.getStudent().getEmail(),
                    studentName,
                    programName,
                    rejectionReason
            );
        } catch (MessagingException e) {
            log.error("Failed to send rejection email to student: {}", e.getMessage(), e);
        }

        return enrollment;
    }

    public Enrollment getMyLatestEnrollment() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Student student = (Student) user;

        return enrollmentRepository.findTopByStudentIdOrderByCreatedDateDesc(student.getId())
                .orElse(null);
    }

    // Helper DTOs for admin requests
    public static class DocumentCorrectionDto {
        private Integer documentId;
        private String reason;

        public Integer getDocumentId() {
            return documentId;
        }

        public void setDocumentId(Integer documentId) {
            this.documentId = documentId;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    public boolean isEnrollmentPaid(Enrollment enrollment) {
        return enrollment.getPayment() != null && "SUCCESSFUL".equals(enrollment.getPayment().getStatus());
    }

    @Transactional
    public void updateEnrollmentStatusAfterPayment(Integer enrollmentId, PaymentType paymentType) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        if (paymentType == PaymentType.REGISTRATION_FEE) {
            // Registration fee paid - enrollment moves to pending validation
            enrollment.setStatus(StatusSubmission.PENDING_VALIDATION);
        } else if (paymentType == PaymentType.PROGRAM_PAYMENT) {
            // Program payment completed - enrollment is fully approved and student is considered enrolled
            enrollment.setStatus(StatusSubmission.ENROLLED);

            // Update student status to INSCRIT
            Student student = enrollment.getStudent();
            student.setStatus(StudentStatus.ENROLLED);
            userRepository.save(student);

            // Send enrollment confirmation email to student
            try {
                String studentName = student.getFirstname() + " " + student.getLastname();
                String programName = enrollment.getProgram().getProgramName();
                LocalDate startDate = enrollment.getProgram().getStartDate();
                LocalDate endDate = enrollment.getProgram().getEndDate();
                Set<String> courseDays = enrollment.getProgram().getCourseDays();
                LocalTime startTime = enrollment.getProgram().getStartTime();
                LocalTime endTime = enrollment.getProgram().getEndTime();

                // Get program modules
                List<String> modules = enrollment.getProgram().getLearnModules().stream()
                        .map(module -> module.getModuleName())
                        .toList();

                emailService.sendEnrollmentConfirmationEmail(
                        student.getEmail(),
                        studentName,
                        programName,
                        startDate,
                        endDate,
                        courseDays,
                        startTime,
                        endTime,
                        modules
                );
            } catch (MessagingException e) {
                log.error("Failed to send enrollment confirmation email to student: {}", e.getMessage(), e);
            }
        }

        enrollmentRepository.save(enrollment);
    }


    @Transactional
    public void cancelEnrollmentIfNoPayment(Integer enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        // Verify that the current user is the owner of this enrollment
        Student currentStudent = (Student) userRepository.findByEmail(
                        SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        if (!enrollment.getStudent().getId().equals(currentStudent.getId())) {
            throw new IllegalStateException("You can only cancel your own enrollments");
        }

        // Check if enrollment has any payments (both enrollment and program payments)
        boolean hasPayments = paymentRepository.existsByEnrollmentId(enrollmentId);
        if (hasPayments) {
            throw new IllegalStateException("Cannot cancel enrollment that has existing payments");
        }

        // Check if enrollment is in a cancellable state
        if (enrollment.getStatus() == StatusSubmission.APPROVED || enrollment.getStatus() == StatusSubmission.ENROLLED) {
            throw new IllegalStateException("Cannot cancel an approved or enrolled enrollment");
        }

        // Cancel the enrollment by setting status to CANCELLED
        enrollment.setStatus(StatusSubmission.CANCELLED);
        enrollment.setSubmissionDate(LocalDateTime.now());
        enrollmentRepository.save(enrollment);

        log.info("Enrollment {} cancelled by student {}", enrollmentId, currentStudent.getEmail());
    }
}