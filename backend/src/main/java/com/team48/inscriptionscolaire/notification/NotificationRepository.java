package com.team48.inscriptionscolaire.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserIdOrderByCreatedDateDesc(Integer userId);

    List<Notification> findByUserIdAndIsReadFalse(Integer userId);

    long countByUserIdAndIsReadFalse(Integer userId);
}