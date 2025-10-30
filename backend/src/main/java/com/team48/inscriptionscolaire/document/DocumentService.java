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


    // New method to download document by ID
    public byte[] downloadDocumentById(Integer id) {
        Optional<Document> document = repository.findById(id);
        if (document.isPresent()) {
            try {
                return DocumentUtils.decompressImage(document.get().getFileData());
            } catch (Exception e) {
                throw new RuntimeException("Error decompressing document with id: " + id + ". " + e.getMessage());
            }
        } else {
            throw new RuntimeException("Document not found with id: " + id);
        }
    }

    // New method to get document by ID
    public DocumentDto getDocumentById(Integer id) {
        Optional<Document> document = repository.findById(id);
        if (document.isPresent()) {
            return DocumentMapper.toDto(document.get());
        } else {
            throw new RuntimeException("Document not found with id: " + id);
        }
    }

    // New method to validate document by ID
    public void validateDocumentById(Integer id) {
        Optional<Document> document = repository.findById(id);
        if (document.isPresent()) {
            Document doc = document.get();
            doc.setValidationStatus(ValidationStatus.VALIDATED);
            doc.setValidationDate(LocalDateTime.now());
            repository.save(doc);
        } else {
            throw new RuntimeException("Document not found with id: " + id);
        }
    }

    // New method to reject document by ID
    public void rejectDocumentById(Integer id, String rejectionReason) {
        Optional<Document> document = repository.findById(id);
        if (document.isPresent()) {
            Document doc = document.get();
            doc.setValidationStatus(ValidationStatus.REJECTED);
            doc.setRejectionReason(rejectionReason);
            doc.setValidationDate(LocalDateTime.now());
            repository.save(doc);
        } else {
            throw new RuntimeException("Document not found with id: " + id);
        }
    }
}