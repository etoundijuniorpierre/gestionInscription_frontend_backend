package com.team48.inscriptionscolaire.enrollment;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.util.List;

@Embeddable
@Data
public class ContactDetails {
    private String email;
    private String phoneNumber;
    private String countryCode;
    private String country;
    private String region;
    private String city;
    private String address;

    @ElementCollection
    private List<EmergencyContact> emergencyContacts;
}