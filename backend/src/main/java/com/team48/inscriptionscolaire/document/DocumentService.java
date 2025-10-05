package com.team48.inscriptionscolaire.document;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository repository;


    public String uploadImage(MultipartFile file) throws IOException {

        Document fileData = repository.save(
                Document.builder()
                        .name(file.getOriginalFilename())
                        .contentType(file.getContentType()) // MODIFIÉ : Utilise la String directement
                        .fileData(DocumentUtils.compressImage(file.getBytes()))
                        .build()
        );

        if (fileData != null) {
            return "file uploaded successfully : " + file.getOriginalFilename();
        }
        return "file upload failed.";
    }

    // MODIFIÉE : C'est la méthode principale à utiliser
    public Document saveDocument(MultipartFile file) throws IOException {
        Document document = new Document();
        document.setName(file.getOriginalFilename());
        // CORRECTION : Utilise directement la String du content type
        document.setContentType(file.getContentType());
        document.setFileData(DocumentUtils.compressImage(file.getBytes()));
        // Vous pouvez aussi initialiser d'autres champs ici si nécessaire
        document.setUploadDate(LocalDateTime.now());
        document.setValidationStatus(ValidationStatus.PENDING);

        return repository.save(document);
    }

    //dowload the image from the db
    public byte[] downloadImage(String fileName){
        Optional<Document> dbDocument = repository.findByName(fileName);
        // Utiliser .orElseThrow pour une meilleure gestion des erreurs si le document n'est pas trouvé
        return dbDocument.map(doc -> DocumentUtils.decompressImage(doc.getFileData()))
                .orElseThrow(() -> new RuntimeException("Document not found with name: " + fileName));
    }
    
    // New method to get document metadata by ID
    public DocumentDto getDocumentById(Integer id) {
        Optional<Document> document = repository.findById(id);
        if (document.isPresent()) {
            Document doc = document.get();
            DocumentDto dto = new DocumentDto();
            dto.setId(doc.getId());
            dto.setName(doc.getName());
            dto.setContentType(doc.getContentType());
            dto.setUploadDate(doc.getUploadDate());
            dto.setValidationStatus(doc.getValidationStatus());
            dto.setDocumentType(doc.getDocumentType());
            dto.setRejectionReason(doc.getRejectionReason());
            dto.setCreatedDate(doc.getCreatedDate());
            dto.setLastModifiedDate(doc.getLastModifiedDate());
            return dto;
        } else {
            throw new RuntimeException("Document not found with id: " + id);
        }
    }
}