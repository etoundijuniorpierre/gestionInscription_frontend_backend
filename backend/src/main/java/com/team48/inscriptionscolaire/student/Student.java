package com.team48.inscriptionscolaire.student;

import com.team48.inscriptionscolaire.common.BaseEntity;
import com.team48.inscriptionscolaire.enrollment.Enrollment;
import com.team48.inscriptionscolaire.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Entity
@SuperBuilder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "students")
@DiscriminatorValue("STUDENT")
public class Student extends User {
    private LocalDate dateOfBirth;
    private String address;
    private String phoneNumber;

    private String gender;

    private String nationality;

    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;

    private int desiredAcademicYear;
    private String intendedFieldOfStudy;

    @OneToMany(mappedBy = "student")
    private List<Enrollment> enrollmentList;
}