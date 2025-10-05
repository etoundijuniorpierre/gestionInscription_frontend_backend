package com.team48.inscriptionscolaire.student;

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
    @OneToMany(mappedBy = "student")
    private List<Enrollment> enrollmentList;
}