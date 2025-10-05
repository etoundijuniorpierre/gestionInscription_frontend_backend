package com.team48.inscriptionscolaire.enrollment;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.team48.inscriptionscolaire.document.DocumentDto;
import com.team48.inscriptionscolaire.enrollment.StatusSubmission;
import com.team48.inscriptionscolaire.stripe.PaymentRequestDto;
import com.team48.inscriptionscolaire.stripe.PaymentResponseDto;
import com.team48.inscriptionscolaire.stripe.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import com.team48.inscriptionscolaire.enrollment.RejectionReasonDto;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;
    private final PaymentService paymentService;

    /**
     * Unified endpoint to handle all steps of the enrollment form, including data and documents.
     */
    @Operation(summary = "Submit or update enrollment form data and documents")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Enrollment created or updated successfully",
                    content = @Content(schema = @Schema(implementation = EnrollmentDtoResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentDtoResponse> submitEnrollment(
            @RequestPart("enrollmentDtoRequest") String enrollmentDtoRequestJson,
            @RequestPart(value = "documents", required = false) List<MultipartFile> documents) throws JsonProcessingException {

        EnrollmentDtoRequest dto = enrollmentService.parseEnrollmentJson(enrollmentDtoRequestJson);
        Enrollment enrollment = enrollmentService.processEnrollment(dto, documents);
        EnrollmentDtoResponse response = convertToDto(enrollment);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{enrollmentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public EnrollmentDtoResponse getEnrollment(@PathVariable Integer enrollmentId) {
        Enrollment enrollment = enrollmentService.getEnrollmentById(enrollmentId);
        return convertToDto(enrollment);
    }

    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public List<EnrollmentDtoResponse> getMyEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getMyEnrollments();
        return enrollments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/my-latest")
    @PreAuthorize("hasRole('STUDENT')")
    public EnrollmentDtoResponse getMyLatestEnrollment() {
        Enrollment enrollment = enrollmentService.getMyLatestEnrollment();
        return enrollment != null ? convertToDto(enrollment) : null;
    }

    // Admin endpoints for getting all enrollments
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all enrollments", description = "Retrieve all enrollments. Accessible only by admins.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "All enrollments retrieved successfully",
                    content = @Content(schema = @Schema(implementation = EnrollmentDtoResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public List<EnrollmentDtoResponse> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        return enrollments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/non-approved")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all non-approved enrollments", description = "Retrieve all non-approved enrollments. Accessible only by admins.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Non-approved enrollments retrieved successfully",
                    content = @Content(schema = @Schema(implementation = EnrollmentDtoResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public List<EnrollmentDtoResponse> getAllNonApprovedEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllNonApprovedEnrollments();
        return enrollments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Admin endpoints (kept as is)
    @GetMapping("/program/{programId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<EnrollmentDtoResponse> getEnrollmentsByProgram(@PathVariable Integer programId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByProgram(programId);
        return enrollments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // FIX: Changed from 'validateEnrollment' to 'approveEnrollment' to match the EnrollmentService
    @PatchMapping("/{enrollmentId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public EnrollmentDtoResponse approveEnrollment(@PathVariable Integer enrollmentId) {
        Enrollment enrollment = enrollmentService.approveEnrollment(enrollmentId);
        return convertToDto(enrollment);
    }

    @PatchMapping("/{enrollmentId}/request-corrections")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Request corrections for an enrollment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Corrections requested successfully",
                    content = @Content(schema = @Schema(implementation = EnrollmentDtoResponse.class))),
            @ApiResponse(responseCode = "404", description = "Enrollment not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public EnrollmentDtoResponse requestCorrections(
            @PathVariable Integer enrollmentId,
            @RequestBody List<EnrollmentService.DocumentCorrectionDto> corrections) {
        Enrollment enrollment = enrollmentService.requestCorrections(enrollmentId, corrections);
        return convertToDto(enrollment);
    }

    @PatchMapping("/{enrollmentId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reject an enrollment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Enrollment rejected successfully",
                    content = @Content(schema = @Schema(implementation = EnrollmentDtoResponse.class))),
            @ApiResponse(responseCode = "404", description = "Enrollment not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public EnrollmentDtoResponse rejectEnrollment(
            @PathVariable Integer enrollmentId,
            @RequestBody RejectionReasonDto rejectionReasonDto) {
        Enrollment enrollment = enrollmentService.rejectEnrollment(enrollmentId, rejectionReasonDto.getRejectionReason());
        return convertToDto(enrollment);
    }


    @PostMapping("/{enrollmentId}/initiate-payment")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Initiate payment for an enrollment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment initiation successful",
                    content = @Content(schema = @Schema(implementation = PaymentResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Enrollment not found"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "400", description = "Enrollment not ready for payment")
    })
    public ResponseEntity<PaymentResponseDto> initiatePayment(@PathVariable Integer enrollmentId) throws Exception {
        Enrollment enrollment = enrollmentService.getEnrollmentById(enrollmentId);
        
        // Check if enrollment is in the correct status for payment
        if (enrollment.getStatus() != StatusSubmission.PENDING && enrollment.getStatus() != StatusSubmission.APPROVED) {
            throw new IllegalStateException("Enrollment must be in PENDING or APPROVED status to initiate payment.");
        }
        
        // Create payment request
        PaymentRequestDto paymentRequest = new PaymentRequestDto();
        paymentRequest.setEnrollmentId(enrollmentId);
        
        // Set amount based on payment type
        if (enrollment.getStatus() == StatusSubmission.APPROVED) {
            // Program payment (you'll need to determine the amount based on your business logic)
            paymentRequest.setAmount(10000L); // Example: $100 in cents
        } else {
            // Registration fee (you'll need to determine the amount based on your business logic)
            paymentRequest.setAmount(5000L); // Example: $50 in cents
        }
        
        // Create Stripe session
        PaymentResponseDto response = paymentService.createStripeSession(paymentRequest);
        return ResponseEntity.ok(response);
    }
    
    private EnrollmentDtoResponse convertToDto(Enrollment enrollment) {
        EnrollmentDtoResponse dto = new EnrollmentDtoResponse();
        dto.setId(enrollment.getId());
        dto.setStatus(enrollment.getStatus());
        dto.setCreatedDate(enrollment.getCreatedDate());
        dto.setSubmissionDate(enrollment.getSubmissionDate());
        dto.setValidationDate(enrollment.getValidationDate());
        dto.setCurrentStep(enrollment.getStepCompleted());
        dto.setProgramId(enrollment.getProgram().getId());
        dto.setStudentId(enrollment.getStudent().getId());
        dto.setProgramName(enrollment.getProgram().getProgramName());
        dto.setRejectionReason(enrollment.getRejectionReason()); // Include rejection reason
        
        // Personal Info
        if (enrollment.getPersonalInfo() != null) {
            PersonalInfo personalInfo = enrollment.getPersonalInfo();
            PersonalInfoDto personalInfoDto = new PersonalInfoDto();
            personalInfoDto.setFirstName(personalInfo.getFirstName());
            personalInfoDto.setLastName(personalInfo.getLastName());
            personalInfoDto.setNationality(personalInfo.getNationality());
            personalInfoDto.setGender(personalInfo.getGender());
            personalInfoDto.setDateOfBirth(personalInfo.getDateOfBirth());
            dto.setPersonalInfo(personalInfoDto);
        }
        
        // Academic Info
        if (enrollment.getAcademicInfo() != null) {
            AcademicInfo academicInfo = enrollment.getAcademicInfo();
            AcademicInfoDto academicInfoDto = new AcademicInfoDto();
            academicInfoDto.setLastInstitution(academicInfo.getLastInstitution());
            academicInfoDto.setSpecialization(academicInfo.getSpecialization());
            academicInfoDto.setAvailableForInternship(academicInfo.getAvailableForInternship());
            academicInfoDto.setStartDate(academicInfo.getStartDate());
            academicInfoDto.setEndDate(academicInfo.getEndDate());
            academicInfoDto.setDiplomaObtained(academicInfo.getDiplomaObtained());
            dto.setAcademicInfo(academicInfoDto);
        }
        
        // Contact Details
        if (enrollment.getContactDetails() != null) {
            ContactDetails contactDetails = enrollment.getContactDetails();
            ContactDetailsDto contactDetailsDto = new ContactDetailsDto();
            contactDetailsDto.setEmail(contactDetails.getEmail());
            contactDetailsDto.setPhoneNumber(contactDetails.getPhoneNumber());
            contactDetailsDto.setCountryCode(contactDetails.getCountryCode());
            contactDetailsDto.setCountry(contactDetails.getCountry());
            contactDetailsDto.setRegion(contactDetails.getRegion());
            contactDetailsDto.setCity(contactDetails.getCity());
            contactDetailsDto.setAddress(contactDetails.getAddress());
            
            if (contactDetails.getEmergencyContacts() != null) {
                List<EmergencyContactDto> emergencyContactDtos = contactDetails.getEmergencyContacts().stream()
                        .map(this::mapEmergencyContactEntityToDto)
                        .collect(Collectors.toList());
                contactDetailsDto.setEmergencyContacts(emergencyContactDtos);
            }
            
            dto.setContactDetails(contactDetailsDto);
        }
        
        // Documents
        if (enrollment.getDocuments() != null) {
            List<DocumentDto> documentDtos = enrollment.getDocuments().stream()
                    .map(doc -> {
                        DocumentDto docDto = new DocumentDto();
                        docDto.setId(doc.getId());
                        docDto.setName(doc.getName());
                        docDto.setDocumentType(doc.getDocumentType());
                        docDto.setUploadDate(doc.getUploadDate());
                        docDto.setValidationStatus(doc.getValidationStatus());
                        docDto.setRejectionReason(doc.getRejectionReason());
                        return docDto;
                    })
                    .collect(Collectors.toList());
            dto.setDocuments(documentDtos);
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