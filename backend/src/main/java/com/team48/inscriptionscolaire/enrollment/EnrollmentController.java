package com.team48.inscriptionscolaire.enrollment;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.team48.inscriptionscolaire.document.DocumentDto;
import com.team48.inscriptionscolaire.enrollment.EnrollmentMapper;
import com.team48.inscriptionscolaire.program.Program;
import com.team48.inscriptionscolaire.program.ProgramMapper;
import com.team48.inscriptionscolaire.program.ProgramResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import com.team48.inscriptionscolaire.student.Student;
import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

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

    @GetMapping("/my-unpaid-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public List<EnrollmentDtoResponse> getMyUnpaidEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getMyUnpaidEnrollments();
        return enrollments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/my-unpaid-programs")
    @PreAuthorize("hasRole('STUDENT')")
    public List<ProgramResponseDTO> getMyUnpaidPrograms() {
        List<Program> programs = enrollmentService.getMyUnpaidPrograms();
        return programs.stream()
                .map(ProgramMapper::toDto)
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
    @Operation(summary = "Get all paid enrollments pending validation", description = "Retrieve all paid enrollments that are pending admin validation. Accessible only by admins.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paid enrollments pending validation retrieved successfully",
                    content = @Content(schema = @Schema(implementation = EnrollmentDtoResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public List<EnrollmentDtoResponse> getAllNonApprovedEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllPaidEnrollmentsPendingValidation();
        return enrollments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/pending-payment")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all enrollments pending payment", description = "Retrieve all enrollments that are pending payment. Accessible only by admins.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Enrollments pending payment retrieved successfully",
                    content = @Content(schema = @Schema(implementation = EnrollmentDtoResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public List<EnrollmentDtoResponse> getAllPendingPaymentEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllPendingPaymentEnrollments();
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
            @ApiResponse(responseCode = "200", description = "Payment initiation successful"),
            @ApiResponse(responseCode = "404", description = "Enrollment not found"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "400", description = "Enrollment not ready for payment")
    })
    public ResponseEntity<String> initiatePayment(@PathVariable Integer enrollmentId) throws Exception {
        // Debug logs for authentication troubleshooting
        System.out.println("=== INITIATE PAYMENT DEBUG ===");
        System.out.println("Enrollment ID: " + enrollmentId);

        // Get the current user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Authenticated user email: " + email);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Student student = (Student) user;
        System.out.println("Student ID: " + student.getId());
        System.out.println("Student role: " + student.getRole());

        // Get enrollment and verify it belongs to the current student
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EntityNotFoundException("Enrollment not found with id: " + enrollmentId));
        System.out.println("Found enrollment with status: " + enrollment.getStatus());

        // Verify that the enrollment belongs to the current student
        if (!enrollment.getStudent().getId().equals(student.getId())) {
            System.out.println("Access denied: enrollment student ID " + enrollment.getStudent().getId() + " != authenticated student ID " + student.getId());
            throw new AccessDeniedException("You can only initiate payment for your own enrollments");
        }

        // Check if enrollment is in the correct status for payment and update accordingly
        if (enrollment.getStatus() == StatusSubmission.SUBMITTED) {
            // First payment - registration fee
            enrollment.setStatus(StatusSubmission.PENDING_PAYMENT);
            enrollmentRepository.save(enrollment);
            System.out.println("Updated enrollment status to PENDING_PAYMENT for registration fee");
        } else if (enrollment.getStatus() == StatusSubmission.PENDING_VALIDATION) {
            // Second payment - program payment (after admin approval)
            enrollment.setStatus(StatusSubmission.PENDING_PROGRAM_PAYMENT);
            enrollmentRepository.save(enrollment);
            System.out.println("Updated enrollment status to PENDING_PROGRAM_PAYMENT for program payment");
        } else if (enrollment.getStatus() != StatusSubmission.PENDING_PAYMENT && 
                   enrollment.getStatus() != StatusSubmission.PENDING_PROGRAM_PAYMENT) {
            System.out.println("Invalid enrollment status for payment: " + enrollment.getStatus());
            throw new IllegalStateException("Enrollment must be in SUBMITTED or PENDING_VALIDATION status to initiate payment.");
        }

        // Return success message - frontend will call the appropriate Flutterwave payment endpoint separately
        if (enrollment.getStatus() == StatusSubmission.PENDING_PAYMENT) {
            return ResponseEntity.ok("Registration fee payment initiation successful. Please proceed with Flutterwave payment.");
        } else {
            return ResponseEntity.ok("Program payment initiation successful. Please proceed with Flutterwave payment.");
        }
    }

    private EnrollmentDtoResponse convertToDto(Enrollment enrollment) {
        return EnrollmentMapper.toDto(enrollment);
    }

    /**
     * Maps EmergencyContact entity to EmergencyContactDto
     *
     * @param emergencyContact the EmergencyContact entity
     * @return the EmergencyContactDto
     */
    private EmergencyContactDto mapEmergencyContactEntityToDto(EmergencyContact emergencyContact) {
        EmergencyContactDto dto = new EmergencyContactDto();
        dto.setName(emergencyContact.getName());
        dto.setPhone(emergencyContact.getPhone());
        dto.setCountryCode(emergencyContact.getCountryCode());
        dto.setRelationship(emergencyContact.getRelationship());
        return dto;
    }

    /**
     * Cancel an enrollment if no payments have been made
     * Allows students to cancel their own enrollment before making any payments
     */
    @DeleteMapping("/{enrollmentId}/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Cancel enrollment", description = "Cancel an enrollment if no payments have been made")
    public ResponseEntity<String> cancelEnrollment (@PathVariable Integer enrollmentId){
        try {
            enrollmentService.cancelEnrollmentIfNoPayment(enrollmentId);
            return ResponseEntity.ok("Enrollment cancelled successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}