package com.team48.inscriptionscolaire.user;

import com.team48.inscriptionscolaire.student.MaritalStatus;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class UserResponseDto {
    // User fields
    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private boolean accountLocked;
    private boolean enabled;
    private String roleName;
    
    // Student-specific fields (will be null for non-student users)
    private LocalDate dateOfBirth;
    private String address;
    private String phoneNumber;
    private String gender;
    private String nationality;
    private MaritalStatus maritalStatus;
    private Integer desiredAcademicYear;
    private String intendedFieldOfStudy;
    
    // Only for student users
    private List<Integer> enrollmentIds;
}