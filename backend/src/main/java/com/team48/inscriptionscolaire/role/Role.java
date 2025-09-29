package com.team48.inscriptionscolaire.role;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.team48.inscriptionscolaire.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@EntityListeners(AuditingEntityListener.class)
public class  Role {

    @Id
    @GeneratedValue
    private Integer id;
    @Column(unique = true) //we don't have the same role multiples times
    private String name;

    @OneToMany(mappedBy = "role")
    @JsonIgnore //ignore the serialization of this entity
    private List<User> user;



   /* @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;
    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime lastModifiedDate;*/
}
