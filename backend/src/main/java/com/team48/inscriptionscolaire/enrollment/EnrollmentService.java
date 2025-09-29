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
import java.time.LocalDateTime;
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
    public EnrollmentDtoResponse processEnrollment(EnrollmentDtoRequest dto, List<MultipartFile> documents) {
        var student = (Student) userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        var program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new EntityNotFoundException("Program not found"));

        var enrollment = enrollmentRepository
                .findByStudentIdAndProgramIdAndAcademicYear(student.getId(), program.getId(), dto.getAcademicYear())
                .orElseGet(() -> {
                    var newEnrollment = new Enrollment();
                    newEnrollment.setStudent(student);
                    newEnrollment.setProgram(program);
                    newEnrollment.setAcademicYear(dto.getAcademicYear());
                    newEnrollment.setStatus(StatusSubmission.IN_PROGRESS);
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
        return convertToDto(savedEnrollment);
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
                !enrollment.getDocuments().stream().anyMatch(doc -> "cniRecto".equals(doc.getDocumentType()))
        ) {
            throw new IllegalStateException("All required documents must be uploaded before final submission.");
        }

        enrollment.setStatus(StatusSubmission.PENDING);
        enrollment.setSubmissionDate(LocalDateTime.now());
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
        PersonalInfo personalInfo = enrollment.getPersonalInfo() != null ? enrollment.getPersonalInfo() : new PersonalInfo();
        personalInfo.setFirstName(personalInfoDto.getFirstName());
        personalInfo.setLastName(personalInfoDto.getLastName());
        personalInfo.setNationality(personalInfoDto.getNationality());
        personalInfo.setGender(personalInfoDto.getGender());
        personalInfo.setDateOfBirth(personalInfoDto.getDateOfBirth());
        enrollment.setPersonalInfo(personalInfo);
    }

    private void updateAcademicInfo(Enrollment enrollment, AcademicInfoDto academicInfoDto) {
        AcademicInfo academicInfo = enrollment.getAcademicInfo() != null ? enrollment.getAcademicInfo() : new AcademicInfo();
        academicInfo.setLastInstitution(academicInfoDto.getLastInstitution());
        academicInfo.setSpecialization(academicInfoDto.getSpecialization());
        academicInfo.setAvailableForInternship(academicInfoDto.getAvailableForInternship());
        academicInfo.setStartDate(academicInfoDto.getStartDate());
        academicInfo.setEndDate(academicInfoDto.getEndDate());
        enrollment.setAcademicInfo(academicInfo);
    }

    private void updateContactDetails(Enrollment enrollment, ContactDetailsDto contactDetailsDto) {
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

    public EnrollmentDtoResponse getEnrollmentById(Integer enrollmentId) {
        return enrollmentRepository.findById(enrollmentId)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found with id: " + enrollmentId));
    }

    public List<EnrollmentDtoResponse> getMyEnrollments() {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        var student = (Student) user;
        return enrollmentRepository.findByStudentId(student.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EnrollmentDtoResponse> getEnrollmentsByProgram(Integer programId) {
        return enrollmentRepository.findByProgramId(programId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EnrollmentDtoResponse> getEnrollmentsByYear(String academicYear) {
        return enrollmentRepository.findByAcademicYear(academicYear)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EnrollmentDtoResponse> getEnrollmentsByProgramAndYear(Integer programId, String academicYear) {
        return enrollmentRepository.findByProgramIdAndAcademicYear(programId, academicYear)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------------------------------------------
    // New methods for admin actions and student dashboard
    // -------------------------------------------------------------------------------------------------

    /**
     * Admin action: Approve an enrollment.
     */
    @Transactional
    public EnrollmentDtoResponse approveEnrollment(Integer enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        // Ensure all documents are approved
        enrollment.getDocuments().forEach(doc -> doc.setValidationStatus(ValidationStatus.APPROVED));

        enrollment.setStatus(StatusSubmission.APPROVED);
        enrollment.setValidationDate(LocalDateTime.now());
        enrollmentRepository.save(enrollment);

        String message = "Félicitations ! Votre demande d'inscription pour le programme '"
                + enrollment.getProgram().getProgramName()
                + "' a été approuvée. Vous pouvez maintenant procéder au paiement.";

        notificationService.sendPrivateNotification(enrollment.getStudent().getUsername(), message);
        return convertToDto(enrollment);
    }

    /**
     * Admin action: Request corrections for specific documents or information.
     */
    @Transactional
    public EnrollmentDtoResponse requestCorrections(Integer enrollmentId, List<DocumentCorrectionDto> corrections) {
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

        return convertToDto(enrollment);
    }

    /**
     * Admin action: Fully reject an enrollment.
     */
    @Transactional
    public EnrollmentDtoResponse rejectEnrollment(Integer enrollmentId, String rejectionReason) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found"));

        enrollment.setStatus(StatusSubmission.REJECTED);
        enrollment.setRejectionReason(rejectionReason);
        enrollmentRepository.save(enrollment);

        String message = "Votre demande d'inscription a été rejetée. Vous pouvez recommencer le processus d'inscription depuis le début.";
        notificationService.sendPrivateNotification(enrollment.getStudent().getUsername(), message);

        return convertToDto(enrollment);
    }

    /**
     * Get the most recent enrollment for the current student.
     * This is what the student dashboard will call on load.
     */
    public EnrollmentDtoResponse getMyLatestEnrollment() {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        var student = (Student) user;

        return enrollmentRepository.findTopByStudentIdOrderByCreatedDateDesc(student.getId())
                .map(this::convertToDto)
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

    private EnrollmentDtoResponse convertToDto(Enrollment enrollment) {
        EnrollmentDtoResponse dto = new EnrollmentDtoResponse();
        dto.setId(enrollment.getId());
        dto.setStatus(enrollment.getStatus());
        dto.setCreatedDate(enrollment.getCreatedDate());
        dto.setSubmissionDate(enrollment.getSubmissionDate());
        dto.setValidationDate(enrollment.getValidationDate());
        dto.setAcademicYear(enrollment.getAcademicYear());
        dto.setCurrentStep(enrollment.getStepCompleted());
        dto.setProgramId(enrollment.getProgram().getId());
        dto.setStudentId(enrollment.getStudent().getId());
        dto.setProgramName(enrollment.getProgram().getProgramName());
        dto.setRejectionReason(enrollment.getRejectionReason()); // Include rejection reason

        if (enrollment.getPersonalInfo() != null) {
            dto.setPersonalInfo(convertPersonalInfoToDto(enrollment.getPersonalInfo()));
        }
        if (enrollment.getAcademicInfo() != null) {
            dto.setAcademicInfo(convertAcademicInfoToDto(enrollment.getAcademicInfo()));
        }
        if (enrollment.getContactDetails() != null) {
            dto.setContactDetails(convertContactDetailsToDto(enrollment.getContactDetails()));
        }
        if (enrollment.getDocuments() != null && !enrollment.getDocuments().isEmpty()) {
            dto.setDocuments(enrollment.getDocuments().stream()
                    .map(this::convertDocumentToDto)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    private DocumentDto convertDocumentToDto(Document document) {
        DocumentDto dto = new DocumentDto();
        dto.setId(document.getId());
        dto.setName(document.getName());
        dto.setContentType(document.getContentType());
        dto.setUploadDate(document.getUploadDate());
        dto.setValidationStatus(document.getValidationStatus());
        dto.setDocumentType(document.getDocumentType());
        dto.setRejectionReason(document.getRejectionReason()); // Include document rejection reason
        return dto;
    }

    private PersonalInfoDto convertPersonalInfoToDto(PersonalInfo personalInfo) {
        PersonalInfoDto dto = new PersonalInfoDto();
        dto.setFirstName(personalInfo.getFirstName());
        dto.setLastName(personalInfo.getLastName());
        dto.setNationality(personalInfo.getNationality());
        dto.setGender(personalInfo.getGender());
        dto.setDateOfBirth(personalInfo.getDateOfBirth());
        return dto;
    }

    private AcademicInfoDto convertAcademicInfoToDto(AcademicInfo academicInfo) {
        AcademicInfoDto dto = new AcademicInfoDto();
        dto.setLastInstitution(academicInfo.getLastInstitution());
        dto.setSpecialization(academicInfo.getSpecialization());
        dto.setAvailableForInternship(academicInfo.getAvailableForInternship());
        dto.setStartDate(academicInfo.getStartDate());
        dto.setEndDate(academicInfo.getEndDate());
        return dto;
    }

    private ContactDetailsDto convertContactDetailsToDto(ContactDetails contactDetails) {
        ContactDetailsDto dto = new ContactDetailsDto();
        dto.setEmail(contactDetails.getEmail());
        dto.setPhoneNumber(contactDetails.getPhoneNumber());
        dto.setCountryCode(contactDetails.getCountryCode());
        dto.setCountry(contactDetails.getCountry());
        dto.setRegion(contactDetails.getRegion());
        dto.setCity(contactDetails.getCity());
        dto.setAddress(contactDetails.getAddress());

        if (contactDetails.getEmergencyContacts() != null) {
            List<EmergencyContactDto> emergencyContactDtos = contactDetails.getEmergencyContacts().stream()
                    .map(this::mapEmergencyContactEntityToDto)
                    .collect(Collectors.toList());
            dto.setEmergencyContacts(emergencyContactDtos);
        }

        return dto;
    }

    private EmergencyContactDto mapEmergencyContactEntityToDto(EmergencyContact entity) {
        EmergencyContactDto dto = new EmergencyContactDto();
        dto.setName(entity.getName());
        dto.setPhone(entity.getPhone());
        dto.setCountryCode(entity.getCountryCode());
        dto.setRelationship(entity.getRelationship());
        return dto;
    }
}