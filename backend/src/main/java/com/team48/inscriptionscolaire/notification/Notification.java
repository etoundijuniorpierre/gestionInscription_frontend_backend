package com.team48.inscriptionscolaire.notification;


import com.team48.inscriptionscolaire.user.BaseEntity;
import com.team48.inscriptionscolaire.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends BaseEntity {
   private String content;
   
   @ManyToOne
   private User user;
   
   private boolean isRead = false;
   
   // Custom constructor for backward compatibility
   public Notification(String content) {
       this.content = content;
       this.isRead = false;
   }
}
