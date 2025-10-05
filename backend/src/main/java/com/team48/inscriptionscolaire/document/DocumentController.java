package com.team48.inscriptionscolaire.document;

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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/images")
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


    //endpoint to download image
    @GetMapping("/{fileName}")
    public ResponseEntity<?> downloadImage (@PathVariable String fileName){
        byte[] imageData = service.downloadImage(fileName);

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(imageData);

    }
    
    // New endpoint to get document metadata by ID
    @GetMapping("/document/{id}")
    @Operation(
            summary = "Get document by ID",
            description = "Retrieve document metadata by its ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document retrieved successfully",
                    content = @Content(schema = @Schema(implementation = DocumentDto.class))),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    public ResponseEntity<DocumentDto> getDocumentById(@PathVariable Integer id) {
        try {
            DocumentDto documentDto = service.getDocumentById(id);
            return ResponseEntity.ok(documentDto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // New endpoint to download document by ID
    @GetMapping("/download/{id}")
    @Operation(
            summary = "Download document by ID",
            description = "Download document file by its ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document downloaded successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    public ResponseEntity<byte[]> downloadDocumentById(@PathVariable Integer id) {
        try {
            DocumentDto documentDto = service.getDocumentById(id);
            byte[] documentData = service.downloadImage(documentDto.getName());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(documentDto.getContentType()))
                    .header("Content-Disposition", "attachment; filename=\"" + documentDto.getName() + "\"")
                    .body(documentData);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}