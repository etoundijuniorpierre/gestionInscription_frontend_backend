package com.team48.inscriptionscolaire.document;

import com.team48.inscriptionscolaire.enrollment.RejectionReasonDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/images")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService service;

    //endpoint to uploadImage
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Upload a document",
            description = "Upload a single document file. Types autorisés: PDF, DOCX, JPG, PNG"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fichier uploadé avec succès"),
            @ApiResponse(responseCode = "400", description = "Type de fichier non supporté"),
            @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    public ResponseEntity<?> uploadImage(
            @Parameter(
                    description = "File to upload (Types autorisés: PDF, DOCX, JPG, PNG)",
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(
                                    type = "string",
                                    format = "binary"
                            )
                    )
            )
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String result = service.uploadImage(file);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur lors du traitement du fichier");
        }
    }


    
    // New endpoint to download document file by ID
    @GetMapping("/document/{id}/download")
    @Operation(
            summary = "Download document file by ID",
            description = "Download the actual document file by its ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document file downloaded successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    public ResponseEntity<?> downloadDocumentById(@PathVariable Integer id) {
        try {
            byte[] documentData = service.downloadDocumentById(id);
            DocumentDto documentDto = service.getDocumentById(id);

            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.parseMediaType(documentDto.getContentType()))
                    .header("Content-Disposition", "attachment; filename=\"" + documentDto.getName() + "\"")
                    .body(documentData);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // New endpoint to validate document by ID
    @PatchMapping("/validate/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Validate document by ID",
            description = "Validate document file by its ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document validated successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<String> validateDocumentById(@PathVariable Integer id) {
        try {
            service.validateDocumentById(id);
            return ResponseEntity.ok("Document validated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // New endpoint to reject document by ID
    @PatchMapping("/reject/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Reject document by ID",
            description = "Reject document file by its ID with rejection reason"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document rejected successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<String> rejectDocumentById(
            @PathVariable Integer id,
            @RequestBody RejectionReasonDto rejectionReasonDto) {
        try {
            service.rejectDocumentById(id, rejectionReasonDto.getRejectionReason());
            return ResponseEntity.ok("Document rejected successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}