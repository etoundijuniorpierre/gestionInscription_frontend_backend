package com.team48.inscriptionscolaire.enrollment;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team48.inscriptionscolaire.document.Document;
import com.team48.inscriptionscolaire.document.DocumentDto;
import com.team48.inscriptionscolaire.document.DocumentRepository;
import com.team48.inscriptionscolaire.document.DocumentService;
import com.team48.inscriptionscolaire.document.FileUploadConfig;
import com.team48.inscriptionscolaire.document.ValidationStatus;
import com.team48.inscriptionscolaire.notification.NotificationService;
import com.team48.inscriptionscolaire.program.Program;
import com.team48.inscriptionscolaire.program.ProgramRepository;
import com.team48.inscriptionscolaire.student.Student;
import com.team48.inscriptionscolaire.user.UserRepository;
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

    @Transactional
    public Enrollment processEnrollment(EnrollmentDtoRequest dto, List<MultipartFile> documents) {
        try {
            var student = (Student) userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                    .orElseThrow(() -> new EntityNotFoundException("Student not found"));
            var program = programRepository.findById(dto.getProgramId())
                    .orElseThrow(() -> new EntityNotFoundException("Program not found"));

            log.info("Processing enrollment for student: {} and program: {}", student.getEmail(), program.getProgramName());

            // Check if enrollments are open for this program
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

            var enrollment = enrollmentRepository
                    .findByStudentIdAndProgramId(student.getId(), program.getId())
                    .orElseGet(() -> {
                        var newEnrollment = new Enrollment();
                        newEnrollment.setStudent(student);
                        newEnrollment.setProgram(program);
                        newEnrollment.setStatus(StatusSubmission.IN_PROGRESS);
                        newEnrollment.setSubmissionDate(LocalDateTime.now()); // Synchroniser avec createdDate
                        log.info("Creating new enrollment for student: {} and program: {}", student.getEmail(), program.getProgramName());
                        return newEnrollment;
                    });

            updatePersonalInfo(enrollment, dto.getPersonalInfo());
            updateAcademicInfo(enrollment, dto.getAcademicInfo());
            updateContactDetails(enrollment, dto.getContactDetails());
            enrollment.setStepCompleted(dto.getCurrentStep());

            if (documents != null && !documents.isEmpty()) {
                addDocumentsToEnrollment(enrollment, documents);
            }

            if (dto.getCurrentStep() == 5) {
                completeEnrollment(enrollment);
            }

            Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
            log.info("Enrollment saved successfully with ID: {}", savedEnrollment.getId());

            // Send notification to student
            try {
                String studentMessage = "Votre demande d'inscription pour le programme '" +
                        program.getProgramName() +
                        "' a été soumise avec succès. Elle est maintenant en attente de validation.";
                notificationService.sendPrivateNotification(student.getUsername(), studentMessage);
                log.info("Student notification sent successfully");
            } catch (Exception e) {
                log.error("Failed to send student notification: {}", e.getMessage(), e);
                // Don't fail the enrollment process if notification fails
            }

            // Send notification to admins
            try {
                String adminMessage = "Une nouvelle demande d'inscription a été soumise par " +
                        student.fullName() +
                        " pour le programme '" +
                        program.getProgramName() + "'.";
                notificationService.sendNotificationToAdmins(adminMessage);
                log.info("Admin notification sent successfully");
            } catch (Exception e) {
                log.error("Failed to send admin notification: {}", e.getMessage(), e);
                // Don't fail the enrollment process if notification fails
            }

            return savedEnrollment;
        } catch (Exception e) {
            log.error("Error processing enrollment: {}", e.getMessage(), e);
            throw e; // Re-throw to maintain original error handling
        }
    }
    
    /**
     * Check if student has conflicting enrollments (programs that start on the same date)
     * @param studentId The student ID
     * @param startDate The start date of the program being enrolled in
     * @param programId The program ID being enrolled in (to exclude self)
     * @return true if there's a conflict, false otherwise
     */
    private boolean hasConflictingEnrollment(Integer studentId, LocalDate startDate, Integer programId) {
        return enrollmentRepository.countByStudentIdAndProgramStartDate(studentId, startDate) > 0;
    }
    
    /**
     * Check if student has conflicting enrollments based on schedule
     * @param studentId The student ID
     * @param newProgram The program being enrolled in
     * @return true if there's a schedule conflict, false otherwise
     */
    private boolean hasScheduleConflict(Integer studentId, Program newProgram) {
        try {
            // Get all active enrollments for the student
            List<Enrollment> activeEnrollments = enrollmentRepository.findByStudentId(studentId)
                    .stream()
                    .filter(e -> e.getStatus() == StatusSubmission.IN_PROGRESS ||
                                e.getStatus() == StatusSubmission.PENDING ||
                                e.getStatus() == StatusSubmission.APPROVED)
                    .toList();

            log.debug("Found {} active enrollments for student {}", activeEnrollments.size(), studentId);

            // Check each active enrollment for schedule conflicts
            for (Enrollment enrollment : activeEnrollments) {
                Program existingProgram = enrollment.getProgram();

                // Skip if it's the same program
                if (existingProgram.getId().equals(newProgram.getId())) {
                    continue;
                }

                // Check if both programs have schedule information
                if (newProgram.getCourseDays() == null || existingProgram.getCourseDays() == null ||
                    newProgram.getStartTime() == null || existingProgram.getStartTime() == null ||
                    newProgram.getEndTime() == null || existingProgram.getEndTime() == null) {
                    log.debug("Skipping conflict check - missing schedule info for programs {} and {}",
                            newProgram.getProgramName(), existingProgram.getProgramName());
                    continue;
                }

                // Check if the programs overlap in time
                if (hasTimeOverlap(newProgram, existingProgram)) {
                    log.warn("Schedule conflict detected between {} and {} for student {}",
                            newProgram.getProgramName(), existingProgram.getProgramName(), studentId);
                    return true;
                }
            }

            return false;
        } catch (Exception e) {
            log.error("Error checking schedule conflicts for student {}: {}", studentId, e.getMessage(), e);
            // Return false to not block enrollment if there's an error in conflict checking
            return false;
        }
    }
    
    /**
     * Check if two programs have overlapping schedules
     * @param program1 First program
     * @param program2 Second program
     * @return true if there's a time overlap, false otherwise
     */
    private boolean hasTimeOverlap(Program program1, Program program2) {
        try {
            // Check if they have any common course days
            boolean hasCommonDay = program1.getCourseDays().stream()
                    .anyMatch(day -> program2.getCourseDays().contains(day));

            if (!hasCommonDay) {
                return false;
            }

            // Check if the time slots overlap
            LocalTime start1 = program1.getStartTime();
            LocalTime end1 = program1.getEndTime();
            LocalTime start2 = program2.getStartTime();
            LocalTime end2 = program2.getEndTime();

            // Time overlap condition: (StartA < EndB) and (StartB < EndA)
            return start1.isBefore(end2) && start2.isBefore(end1);
        } catch (Exception e) {
            log.error("Error checking time overlap between {} and {}: {}",
                    program1.getProgramName(), program2.getProgramName(), e.getMessage(), e);
            // Return false if there's an error in overlap checking
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

        enrollment.setStatus(StatusSubmission.PENDING);
        // submissionDate est déjà défini lors de la création et égal à createdDate
        // Ne pas le modifier ici pour maintenir la synchronisation
        
        // Payment will be created when student initiates the payment process
        // Payment is now the final step of enrollment
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
                document.setValidationStatus(ValidationStatus.PENDING); // New documents are pending
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
            return;
        }
        PersonalInfo personalInfo = enrollment.getPersonalInfo() != null ? enrollment.getPersonalInfo() : new PersonalInfo();
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
                    "Type de fichier non autorisé. Types acceptés: " +
                            String.join(", ", fileUploadConfig.getAllowedFileTypes())
            );
        }
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        if (extension == null || !fileUploadConfig.getAllowedExtensions().contains(extension.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Extension non autorisée. Extensions acceptées: " +
                            String.join(", ", fileUploadConfig.getAllowedExtensions())
            );
        }
    }

    public Enrollment getEnrollmentById(Integer enrollmentId) {
        return enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found with id: " + enrollmentId));
    }

    public List<Enrollment> getMyEnrollments() {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        var student = (Student) user;
        return enrollmentRepository.findByStudentId(student.getId());
    }

    public List<Enrollment> getEnrollmentsByProgram(Integer programId) {
        return enrollmentRepository.findByProgramId(programId);
    }

    // New methods to get all enrollments and non-approved enrollments
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getAllNonApprovedEnrollments() {
        return enrollmentRepository.findAllNonApproved();
    }

    // -------------------------------------------------------------------------------------------------
    // New methods for admin actions and student dashboard
    // -------------------------------------------------------------------------------------------------

    /**
     * Admin action: Approve an enrollment.
     */
    @Transactional
    public Enrollment approveEnrollment(Integer enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        // Check if payment has been made before approving
        if (enrollment.getPayment() == null || !"COMPLETED".equals(enrollment.getPayment().getStatus())) {
            throw new IllegalStateException("Enrollment payment must be completed before approval.");
        }

        // Ensure all documents are approved
        enrollment.getDocuments().forEach(doc -> doc.setValidationStatus(ValidationStatus.APPROVED));

        enrollment.setStatus(StatusSubmission.APPROVED);
        enrollment.setValidationDate(LocalDateTime.now());
        enrollmentRepository.save(enrollment);

        String message = "Félicitations ! Votre demande d'inscription pour le programme '"
                + enrollment.getProgram().getProgramName()
                + "' a été approuvée.";

        notificationService.sendPrivateNotification(enrollment.getStudent().getUsername(), message);
        return enrollment;
    }

    /**
     * Admin action: Request corrections for specific documents or information.
     */
    @Transactional
    public Enrollment requestCorrections(Integer enrollmentId, List<DocumentCorrectionDto> corrections) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        enrollment.setStatus(StatusSubmission.CORRECTIONS_REQUIRED);
        enrollmentRepository.save(enrollment);

        // Update validation status and add rejection reasons to specific documents
        if (corrections != null && !corrections.isEmpty()) {
            corrections.forEach(correction -> documentRepository.findById(correction.getDocumentId())
                    .ifPresent(doc -> {
                        doc.setRejectionReason(correction.getReason());
                        doc.setValidationStatus(ValidationStatus.REJECTED); // Mark as rejected for student to see
                        documentRepository.save(doc);
                    }));
        }

        String message = "Votre demande d'inscription nécessite des corrections. Veuillez vérifier votre tableau de bord pour les détails et les documents à mettre à jour.";
        notificationService.sendPrivateNotification(enrollment.getStudent().getUsername(), message);

        return enrollment;
    }

    /**
     * Admin action: Fully reject an enrollment.
     */
    @Transactional
    public Enrollment rejectEnrollment(Integer enrollmentId, String rejectionReason) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        // Check if payment has been made before rejecting
        if (enrollment.getPayment() == null || !"COMPLETED".equals(enrollment.getPayment().getStatus())) {
            throw new IllegalStateException("Enrollment payment must be completed before rejection.");
        }

        enrollment.setStatus(StatusSubmission.REJECTED);
        enrollment.setRejectionReason(rejectionReason);
        enrollmentRepository.save(enrollment);

        String message = "Votre demande d'inscription a été rejetée. Vous pouvez recommencer le processus d'inscription depuis le début.";
        notificationService.sendPrivateNotification(enrollment.getStudent().getUsername(), message);

        return enrollment;
    }

    /**
     * Get the most recent enrollment for the current student.
     * This is what the student dashboard will call on load.
     */
    public Enrollment getMyLatestEnrollment() {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        var student = (Student) user;

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

    /**
     * Check if an enrollment has a completed payment
     * @param enrollment The enrollment to check
     * @return true if payment is completed, false otherwise
     */
    public boolean isEnrollmentPaid(Enrollment enrollment) {
        return enrollment.getPayment() != null && "COMPLETED".equals(enrollment.getPayment().getStatus());
    }

    /**
     * Get the payment status for an enrollment
     * @param enrollment The enrollment to check
     * @return Payment status string
     */
    public String getEnrollmentPaymentStatus(Enrollment enrollment) {
        if (enrollment.getPayment() == null) {
            return "NO_PAYMENT";
        }
        return enrollment.getPayment().getStatus();
    }
}