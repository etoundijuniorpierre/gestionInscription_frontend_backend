package com.team48.inscriptionscolaire.email;

import lombok.Getter;

@Getter
public enum EmailTemplateName {
    ACTIVATE_ACCOUNT("activate_account"),
    ENROLLMENT_REJECTION("enrollment_rejection"),
    ENROLLMENT_CONFIRMATION("enrollment_confirmation");
    private final String name;

    EmailTemplateName(String name) {
        this.name = name;
    }
}