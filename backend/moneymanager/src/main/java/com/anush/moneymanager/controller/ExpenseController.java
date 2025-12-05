package com.anush.moneymanager.controller;

import com.anush.moneymanager.dto.DateRangeDTO;
import com.anush.moneymanager.dto.ExpenseDTO;
import com.anush.moneymanager.entity.Expense;
import com.anush.moneymanager.entity.User;
import com.anush.moneymanager.repository.ExpenseRepository;
import com.anush.moneymanager.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addExpense(@Valid @RequestBody ExpenseDTO expenseDTO, Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());

        if (userOptional.isPresent()) {
            Expense expense = new Expense();
            expense.setAmount(expenseDTO.getAmount());
            expense.setCategory(expenseDTO.getCategory());
            expense.setDescription(expenseDTO.getDescription());
            expense.setDate(expenseDTO.getDate());
            expense.setUser(userOptional.get());

            expenseRepository.save(expense);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Expense added successfully");
            response.put("id", expense.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllExpenses(Principal principal) {
        List<Expense> expenses = expenseRepository.findByUserUsername(principal.getName());
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExpenseById(@PathVariable Long id, Principal principal) {
        Optional<Expense> expenseOptional = expenseRepository.findById(id);

        if (expenseOptional.isPresent()) {
            Expense expense = expenseOptional.get();
            // Check if the expense belongs to the authenticated user
            if (expense.getUser().getUsername().equals(principal.getName())) {
                return ResponseEntity.ok(expense);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @Valid @RequestBody ExpenseDTO expenseDTO,
            Principal principal) {
        Optional<Expense> expenseOptional = expenseRepository.findById(id);

        if (expenseOptional.isPresent()) {
            Expense expense = expenseOptional.get();

            // Check if the expense belongs to the authenticated user
            if (!expense.getUser().getUsername().equals(principal.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            expense.setAmount(expenseDTO.getAmount());
            expense.setCategory(expenseDTO.getCategory());
            expense.setDescription(expenseDTO.getDescription());
            expense.setDate(expenseDTO.getDate());

            expenseRepository.save(expense);
            return ResponseEntity.ok("Expense updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id, Principal principal) {
        Optional<Expense> expenseOptional = expenseRepository.findById(id);

        if (expenseOptional.isPresent()) {
            Expense expense = expenseOptional.get();

            // Check if the expense belongs to the authenticated user
            if (!expense.getUser().getUsername().equals(principal.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            expenseRepository.delete(expense);
            return ResponseEntity.ok("Expense deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found");
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getExpensesByCategory(@PathVariable String category, Principal principal) {
        List<Expense> expenses = expenseRepository.findByCategoryAndUserUsername(category, principal.getName());
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/date-range")
    public ResponseEntity<?> getExpensesByDateRange(@Valid @RequestBody DateRangeDTO dateRangeDTO,
            Principal principal) {
        List<Expense> expenses = expenseRepository.findByUserUsernameAndDateBetween(
                principal.getName(), dateRangeDTO.getStartDate(), dateRangeDTO.getEndDate());
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/total")
    public ResponseEntity<?> getTotalExpense(Principal principal) {
        Double totalExpense = expenseRepository.getTotalExpensesByUser(principal.getName());
        return ResponseEntity.ok(totalExpense != null ? totalExpense : 0.0);
    }

    @GetMapping("/by-category")
    public ResponseEntity<?> getExpensesByCategory(Principal principal) {
        List<Object[]> expensesByCategory = expenseRepository.getTotalExpensesByCategory(principal.getName());
        return ResponseEntity.ok(expensesByCategory);
    }
}
