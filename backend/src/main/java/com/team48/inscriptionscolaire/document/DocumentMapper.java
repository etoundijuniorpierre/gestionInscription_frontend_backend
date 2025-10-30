package com.team48.inscriptionscolaire.document;

public class DocumentMapper {
    public static DocumentDto toDto(Document document) {
        if (document == null) {
            return null;
        }

        return DocumentDto.builder()
                .id(document.getId())
                .name(document.getName())
                .contentType(document.getContentType())
                .uploadDate(document.getUploadDate())
                .validationStatus(document.getValidationStatus())
                .documentType(document.getDocumentType())
                .rejectionReason(document.getRejectionReason())
                .createdDate(document.getCreatedDate())
                .lastModifiedDate(document.getLastModifiedDate())
                .build();
    }
}