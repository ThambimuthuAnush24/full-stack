package com.anush.moneymanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anush.moneymanager.model.LoginRequest;
import com.anush.moneymanager.service.UserService;
import com.anush.moneymanager.util.JwtUtil;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @GetMapping("/health")
    public Map<String, String> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "API is running");
        return response;
    }

    @GetMapping("/auth-check")
    public Map<String, Object> authCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("authEndpoint", "/api/auth/login");
        response.put("method", "POST");
        response.put("expectedBody", Map.of(
                "username", "yourUsername",
                "password", "yourPassword"));
        response.put("expectedResponse", Map.of(
                "token", "jwt-token-value",
                "type", "Bearer",
                "id", "userId",
                "username", "username",
                "email", "email@example.com",
                "role", "ROLE_USER"));
        return response;
    }

    @PostMapping("/token-info")
    public Map<String, Object> getTokenInfo(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        Map<String, Object> response = new HashMap<>();

        if (token != null && !token.isEmpty()) {
            try {
                String username = jwtUtil.getUsernameFromToken(token);
                boolean isValid = jwtUtil.validateToken(token);

                response.put("valid", isValid);
                response.put("username", username);
                response.put("expired", !isValid);

            } catch (Exception e) {
                response.put("valid", false);
                response.put("error", e.getMessage());
            }
        } else {
            response.put("valid", false);
            response.put("error", "No token provided");
        }

        return response;
    }
}