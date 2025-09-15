package com.anush.moneymanager.repository;

import com.anush.moneymanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by username
    Optional<User> findByUsername(String username);

    // Check if username exists
    Boolean existsByUsername(String username);

    // Find user by email
    Optional<User> findByEmail(String email);

    // Check if email exists
    Boolean existsByEmail(String email);
}