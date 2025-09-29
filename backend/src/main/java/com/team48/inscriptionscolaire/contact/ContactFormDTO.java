package com.team48.inscriptionscolaire.contact;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class ContactFormDTO {
    @NotBlank
    private String name;

    @Email
    private String email;

    @NotBlank
    private String subject;

    @NotBlank
    private String message;
}