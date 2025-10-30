package com.team48.inscriptionscolaire.email;

import lombok.Data;

@Data
public class EmailRequestDto {
    private String recipientEmail;
    private String subject;
    private String content;
}
