package com.team48.inscriptionscolaire.enrollment;

import com.team48.inscriptionscolaire.document.DocumentDto;
import com.team48.inscriptionscolaire.document.DocumentMapper;
import com.team48.inscriptionscolaire.program.ProgramMapper;

import java.util.List;
import java.util.stream.Collectors;

public class EnrollmentMapper {

    public static EnrollmentDtoResponse toDto(Enrollment enrollment) {
        if (enrollment == null) {
            return null;
        }

        EnrollmentDtoResponse dto = new EnrollmentDtoResponse();
        dto.setId(enrollment.getId());
        dto.setStatus(enrollment.getStatus());
        dto.setCreatedDate(enrollment.getCreatedDate());
        dto.setSubmissionDate(enrollment.getSubmissionDate());
        dto.setValidationDate(enrollment.getValidationDate());
        dto.setCurrentStep(enrollment.getStepCompleted());
        dto.setRejectionReason(enrollment.getRejectionReason()); // Include rejection reason

        // Set program information if available
        if (enrollment.getProgram() != null) {
            dto.setProgramId(enrollment.getProgram().getId());
            dto.setProgramName(enrollment.getProgram().getProgramName());
            // Add full program data
            dto.setProgram(ProgramMapper.toDto(enrollment.getProgram()));
        }

        // Set student information if available
        if (enrollment.getStudent() != null) {
            dto.setStudentId(enrollment.getStudent().getId());
        }

        // Set payment type based on enrollment status
        // This helps the frontend determine which message to show
        if (enrollment.getStatus() == StatusSubmission.PENDING_PAYMENT) {
            // For pending payment, we need to check the enrollment's previous state
            // If the enrollment was already approved, this pending payment is for the program
            // Otherwise, it's for registration fees
            // Since we can't determine this from the current status alone, we'll default to REGISTRATION_FEE
            // The frontend will need to determine the correct type based on context
            dto.setPaymentType("REGISTRATION_FEE");
        } else if (enrollment.getStatus() == StatusSubmission.PENDING_PROGRAM_PAYMENT ||
                enrollment.getStatus() == StatusSubmission.APPROVED ||
                enrollment.getStatus() == StatusSubmission.ENROLLED) {
            // If status is PENDING_PROGRAM_PAYMENT, APPROVED, or ENROLLED, it's for program payment
            dto.setPaymentType("PROGRAM_PAYMENT");
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