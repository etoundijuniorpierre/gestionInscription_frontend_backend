package com.team48.inscriptionscolaire.enrollment;

import com.team48.inscriptionscolaire.document.Document;
import com.team48.inscriptionscolaire.document.DocumentDto;
import com.team48.inscriptionscolaire.document.DocumentMapper;
import com.team48.inscriptionscolaire.program.Program;
import com.team48.inscriptionscolaire.student.Student;

import java.util.List;
import java.util.stream.Collectors;

public class EnrollmentMapper {
    
    public static Enrollment toEntity(EnrollmentDtoResponse dto) {
        if (dto == null) {
            return null;
        }
        
        Enrollment enrollment = new Enrollment();
        enrollment.setId(dto.getId());
        enrollment.setSubmissionDate(dto.getSubmissionDate());
        enrollment.setStatus(dto.getStatus());
        enrollment.setValidationDate(dto.getValidationDate());
        enrollment.setRejectionReason(dto.getRejectionReason());
        enrollment.setStepCompleted(dto.getCurrentStep());
        
        // Map embedded objects
        if (dto.getPersonalInfo() != null) {
            PersonalInfo personalInfo = new PersonalInfo();
            personalInfo.setFirstName(dto.getPersonalInfo().getFirstName());
            personalInfo.setLastName(dto.getPersonalInfo().getLastName());
            personalInfo.setNationality(dto.getPersonalInfo().getNationality());
            personalInfo.setGender(dto.getPersonalInfo().getGender());
            personalInfo.setDateOfBirth(dto.getPersonalInfo().getDateOfBirth());
            enrollment.setPersonalInfo(personalInfo);
        }
        
        if (dto.getAcademicInfo() != null) {
            AcademicInfo academicInfo = new AcademicInfo();
            academicInfo.setLastInstitution(dto.getAcademicInfo().getLastInstitution());
            academicInfo.setSpecialization(dto.getAcademicInfo().getSpecialization());
            academicInfo.setAvailableForInternship(dto.getAcademicInfo().getAvailableForInternship());
            academicInfo.setStartDate(dto.getAcademicInfo().getStartDate());
            academicInfo.setEndDate(dto.getAcademicInfo().getEndDate());
            academicInfo.setDiplomaObtained(dto.getAcademicInfo().getDiplomaObtained());
            enrollment.setAcademicInfo(academicInfo);
        }
        
        if (dto.getContactDetails() != null) {
            ContactDetails contactDetails = new ContactDetails();
            contactDetails.setEmail(dto.getContactDetails().getEmail());
            contactDetails.setPhoneNumber(dto.getContactDetails().getPhoneNumber());
            contactDetails.setCountryCode(dto.getContactDetails().getCountryCode());
            contactDetails.setCountry(dto.getContactDetails().getCountry());
            contactDetails.setRegion(dto.getContactDetails().getRegion());
            contactDetails.setCity(dto.getContactDetails().getCity());
            contactDetails.setAddress(dto.getContactDetails().getAddress());
            
            if (dto.getContactDetails().getEmergencyContacts() != null) {
                List<EmergencyContact> emergencyContacts = dto.getContactDetails().getEmergencyContacts().stream()
                        .map(emergencyContactDto -> {
                            EmergencyContact emergencyContact = new EmergencyContact();
                            emergencyContact.setName(emergencyContactDto.getName());
                            emergencyContact.setPhone(emergencyContactDto.getPhone());
                            emergencyContact.setCountryCode(emergencyContactDto.getCountryCode());
                            emergencyContact.setRelationship(emergencyContactDto.getRelationship());
                            return emergencyContact;
                        })
                        .collect(Collectors.toList());
                contactDetails.setEmergencyContacts(emergencyContacts);
            }
            
            enrollment.setContactDetails(contactDetails);
        }
        
        // Note: We don't map student and program here as they are typically set by the service layer
        // based on IDs or other business logic
        
        return enrollment;
    }
    
    public static EnrollmentDtoResponse toDto(Enrollment enrollment) {
        if (enrollment == null) {
            return null;
        }
        
        EnrollmentDtoResponse dto = new EnrollmentDtoResponse();
        dto.setId(enrollment.getId());
        dto.setSubmissionDate(enrollment.getSubmissionDate());
        dto.setStatus(enrollment.getStatus());
        dto.setValidationDate(enrollment.getValidationDate());
        dto.setRejectionReason(enrollment.getRejectionReason());
        dto.setCurrentStep(enrollment.getStepCompleted());
        dto.setCreatedDate(enrollment.getCreatedDate());
        dto.setLastModifiedDate(enrollment.getLastModifiedDate());
        
        // Set program information if available
        if (enrollment.getProgram() != null) {
            dto.setProgramId(enrollment.getProgram().getId());
            dto.setProgramName(enrollment.getProgram().getProgramName());
        }
        
        // Set student information if available
        if (enrollment.getStudent() != null) {
            dto.setStudentId(enrollment.getStudent().getId());
        }
        
        // Map embedded objects
        if (enrollment.getPersonalInfo() != null) {
            PersonalInfoDto personalInfoDto = new PersonalInfoDto();
            personalInfoDto.setFirstName(enrollment.getPersonalInfo().getFirstName());
            personalInfoDto.setLastName(enrollment.getPersonalInfo().getLastName());
            personalInfoDto.setNationality(enrollment.getPersonalInfo().getNationality());
            personalInfoDto.setGender(enrollment.getPersonalInfo().getGender());
            personalInfoDto.setDateOfBirth(enrollment.getPersonalInfo().getDateOfBirth());
            dto.setPersonalInfo(personalInfoDto);
        }
        
        if (enrollment.getAcademicInfo() != null) {
            AcademicInfoDto academicInfoDto = new AcademicInfoDto();
            academicInfoDto.setLastInstitution(enrollment.getAcademicInfo().getLastInstitution());
            academicInfoDto.setSpecialization(enrollment.getAcademicInfo().getSpecialization());
            academicInfoDto.setAvailableForInternship(enrollment.getAcademicInfo().getAvailableForInternship());
            academicInfoDto.setStartDate(enrollment.getAcademicInfo().getStartDate());
            academicInfoDto.setEndDate(enrollment.getAcademicInfo().getEndDate());
            academicInfoDto.setDiplomaObtained(enrollment.getAcademicInfo().getDiplomaObtained());
            dto.setAcademicInfo(academicInfoDto);
        }
        
        if (enrollment.getContactDetails() != null) {
            ContactDetailsDto contactDetailsDto = new ContactDetailsDto();
            contactDetailsDto.setEmail(enrollment.getContactDetails().getEmail());
            contactDetailsDto.setPhoneNumber(enrollment.getContactDetails().getPhoneNumber());
            contactDetailsDto.setCountryCode(enrollment.getContactDetails().getCountryCode());
            contactDetailsDto.setCountry(enrollment.getContactDetails().getCountry());
            contactDetailsDto.setRegion(enrollment.getContactDetails().getRegion());
            contactDetailsDto.setCity(enrollment.getContactDetails().getCity());
            contactDetailsDto.setAddress(enrollment.getContactDetails().getAddress());
            
            if (enrollment.getContactDetails().getEmergencyContacts() != null) {
                List<EmergencyContactDto> emergencyContactDtos = enrollment.getContactDetails().getEmergencyContacts().stream()
                        .map(emergencyContact -> {
                            EmergencyContactDto emergencyContactDto = new EmergencyContactDto();
                            emergencyContactDto.setName(emergencyContact.getName());
                            emergencyContactDto.setPhone(emergencyContact.getPhone());
                            emergencyContactDto.setCountryCode(emergencyContact.getCountryCode());
                            emergencyContactDto.setRelationship(emergencyContact.getRelationship());
                            return emergencyContactDto;
                        })
                        .collect(Collectors.toList());
                contactDetailsDto.setEmergencyContacts(emergencyContactDtos);
            }
            
            dto.setContactDetails(contactDetailsDto);
        }
        
        // Map documents if available
        if (enrollment.getDocuments() != null) {
            List<DocumentDto> documentDtos = enrollment.getDocuments().stream()
                    .map(DocumentMapper::toDto)
                    .collect(Collectors.toList());
            dto.setDocuments(documentDtos);
        }
        
        return dto;
    }
}