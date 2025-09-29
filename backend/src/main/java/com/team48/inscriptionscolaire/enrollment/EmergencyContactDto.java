package com.team48.inscriptionscolaire.enrollment;

import lombok.Data;

@Data
public class EmergencyContactDto {
    private String name;
    private String phone;
    private String countryCode;
    private String relationship;
}