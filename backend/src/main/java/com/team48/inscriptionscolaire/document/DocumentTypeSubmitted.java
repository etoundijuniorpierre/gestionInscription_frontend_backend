package com.team48.inscriptionscolaire.document;

public enum DocumentTypeSubmitted {
    APPLICATION_PDF("application/pdf"),
    APPLICATION_DOCX("application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    IMAGE_JPEG("image/jpeg"),
    IMAGE_PNG("image/png");

    private final String mimeType;

    DocumentTypeSubmitted(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getMimeType() {
        return mimeType;
    }

    public static DocumentTypeSubmitted fromMimeType(String mimeType) {
        for (DocumentTypeSubmitted type : values()) {
            if (type.mimeType.equalsIgnoreCase(mimeType)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Type MIME non supporté: " + mimeType);
    }
}
