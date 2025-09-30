package com.team48.inscriptionscolaire.enrollment;

import com.fasterxml.jackson.core.JsonProcessingException;
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

@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

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
        EnrollmentDtoResponse response = enrollmentService.processEnrollment(dto, documents);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{enrollmentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public EnrollmentDtoResponse getEnrollment(@PathVariable Integer enrollmentId) {
        return enrollmentService.getEnrollmentById(enrollmentId);
    }

    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public List<EnrollmentDtoResponse> getMyEnrollments() {
        return enrollmentService.getMyEnrollments();
    }

    @GetMapping("/my-latest")
    @PreAuthorize("hasRole('STUDENT')")
    public EnrollmentDtoResponse getMyLatestEnrollment() {
        return enrollmentService.getMyLatestEnrollment();
    }

    // Admin endpoints (kept as is)
    @GetMapping("/program/{programId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<EnrollmentDtoResponse> getEnrollmentsByProgram(@PathVariable Integer programId) {
        return enrollmentService.getEnrollmentsByProgram(programId);
    }

    // FIX: Changed from 'validateEnrollment' to 'approveEnrollment' to match the EnrollmentService
    @PatchMapping("/{enrollmentId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public EnrollmentDtoResponse approveEnrollment(@PathVariable Integer enrollmentId) {
        return enrollmentService.approveEnrollment(enrollmentId);
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
        return enrollmentService.requestCorrections(enrollmentId, corrections);
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
        return enrollmentService.rejectEnrollment(enrollmentId, rejectionReasonDto.getRejectionReason());
    }

    @GetMapping("/year/{academicYear}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<EnrollmentDtoResponse> getEnrollmentsByYear(@PathVariable String academicYear) {
        return enrollmentService.getEnrollmentsByYear(academicYear);
    }

    @GetMapping("/program/{programId}/year/{academicYear}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<EnrollmentDtoResponse> getEnrollmentsByProgramAndYear(
            @PathVariable Integer programId,
            @PathVariable String academicYear) {
        return enrollmentService.getEnrollmentsByProgramAndYear(programId, academicYear);
    }

    @GetMapping("/available-academic-years")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public List<String> getAvailableAcademicYears() {
        int currentYear = LocalDate.now().getYear();
        List<String> years = new ArrayList<>();

        for (int i = 0; i < 3; i++) {
            years.add((currentYear + i) + "-" + (currentYear + i + 1));
        }

        return years;
    }
}