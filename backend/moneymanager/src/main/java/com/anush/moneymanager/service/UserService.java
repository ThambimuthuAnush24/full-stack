package com.anush.moneymanager.service;

import com.anush.moneymanager.entity.User;
import com.anush.moneymanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register a new user
     */
    @Transactional
    public User registerUser(User user) {
        // Check if username already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Find user by username
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Check if username exists
     */
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Check if email exists
     */
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Get user by ID
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Update user profile
     */
    @Transactional
    public User updateUserProfile(User user) {
        Optional<User> existingUser = userRepository.findById(user.getId());

        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();

            // Update fields
            if (user.getFirstName() != null) {
                userToUpdate.setFirstName(user.getFirstName());
            }

            if (user.getLastName() != null) {
                userToUpdate.setLastName(user.getLastName());
            }

            if (user.getEmail() != null && !userToUpdate.getEmail().equals(user.getEmail())) {
                // Check if the new email is already in use by another user
                if (userRepository.findByEmail(user.getEmail()).isPresent() &&
                        !userRepository.findByEmail(user.getEmail()).get().getId().equals(user.getId())) {
                    throw new RuntimeException("Email already in use");
                }
                userToUpdate.setEmail(user.getEmail());
            }

            return userRepository.save(userToUpdate);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    /**
     * Change user password
     */
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }

            // Update with new password
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    /**
     * Update user information
     */
    public User updateUser(User user) {
        // Ensure the user exists
        if (!userRepository.existsById(user.getId())) {
            throw new RuntimeException("User not found");
        }

        // If password is being updated, encode it
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }

    /**
     * Delete user by ID
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Verify user credentials
     */
    public boolean verifyUserCredentials(String username, String rawPassword) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return passwordEncoder.matches(rawPassword, user.getPassword());
        }
        return false;
    }
}
