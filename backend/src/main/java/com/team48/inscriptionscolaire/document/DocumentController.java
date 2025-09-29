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
}
