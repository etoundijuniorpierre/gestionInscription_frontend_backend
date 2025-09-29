package com.team48.inscriptionscolaire.enrollment;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class EmergencyContact {
    private String name;
    private String phone;
    private String countryCode;
    private String relationship;
}