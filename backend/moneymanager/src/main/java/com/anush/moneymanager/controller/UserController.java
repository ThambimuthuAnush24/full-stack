package com.anush.moneymanager.controller;

import com.anush.moneymanager.entity.User;
import com.anush.moneymanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Principal principal) {
        try {
            User user = userService.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Don't return the password
            user.setPassword(null);

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody User user, Principal principal) {
        try {
            User currentUser = userService.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Ensure the user is updating their own profile
            user.setId(currentUser.getId());

            // Keep the existing password (don't allow password update through this
            // endpoint)
            user.setPassword(currentUser.getPassword());

            User updatedUser = userService.updateUserProfile(user);

            // Don't return the password
            updatedUser.setPassword(null);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating user profile: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordData, Principal principal) {
        try {
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Current password and new password are required");
            }

            User user = userService.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            userService.changePassword(user.getId(), currentPassword, newPassword);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error changing password: " + e.getMessage());
        }
    }

}
