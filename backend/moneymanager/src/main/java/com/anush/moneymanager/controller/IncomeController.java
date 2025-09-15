package com.anush.moneymanager.controller;

import com.anush.moneymanager.dto.DateRangeDTO;
import com.anush.moneymanager.dto.IncomeDTO;
import com.anush.moneymanager.entity.Income;
import com.anush.moneymanager.entity.User;
import com.anush.moneymanager.repository.IncomeRepository;
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
@RequestMapping("/api/income")
public class IncomeController {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addIncome(@Valid @RequestBody IncomeDTO incomeDTO, Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());

        if (userOptional.isPresent()) {
            Income income = new Income();
            income.setAmount(incomeDTO.getAmount());
            income.setCategory(incomeDTO.getCategory());
            income.setDescription(incomeDTO.getDescription());
            income.setDate(incomeDTO.getDate());
            income.setEmoji(incomeDTO.getEmoji());
            income.setUser(userOptional.get());

            incomeRepository.save(income);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Income added successfully");
            response.put("id", income.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllIncomes(Principal principal) {
        List<Income> incomes = incomeRepository.findByUserUsername(principal.getName());
        return ResponseEntity.ok(incomes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getIncomeById(@PathVariable Long id, Principal principal) {
        Optional<Income> incomeOptional = incomeRepository.findById(id);

        if (incomeOptional.isPresent()) {
            Income income = incomeOptional.get();
            // Check if the income belongs to the authenticated user
            if (income.getUser().getUsername().equals(principal.getName())) {
                return ResponseEntity.ok(income);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Income not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateIncome(@PathVariable Long id, @Valid @RequestBody IncomeDTO incomeDTO,
            Principal principal) {
        Optional<Income> incomeOptional = incomeRepository.findById(id);

        if (incomeOptional.isPresent()) {
            Income income = incomeOptional.get();

            // Check if the income belongs to the authenticated user
            if (!income.getUser().getUsername().equals(principal.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            income.setAmount(incomeDTO.getAmount());
            income.setCategory(incomeDTO.getCategory());
            income.setDescription(incomeDTO.getDescription());
            income.setDate(incomeDTO.getDate());
            income.setEmoji(incomeDTO.getEmoji());

            incomeRepository.save(income);
            return ResponseEntity.ok("Income updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Income not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable Long id, Principal principal) {
        Optional<Income> incomeOptional = incomeRepository.findById(id);

        if (incomeOptional.isPresent()) {
            Income income = incomeOptional.get();

            // Check if the income belongs to the authenticated user
            if (!income.getUser().getUsername().equals(principal.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            incomeRepository.delete(income);
            return ResponseEntity.ok("Income deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Income not found");
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getIncomesByCategory(@PathVariable String category, Principal principal) {
        List<Income> incomes = incomeRepository.findByCategoryAndUserUsername(category, principal.getName());
        return ResponseEntity.ok(incomes);
    }

    @PostMapping("/date-range")
    public ResponseEntity<?> getIncomesByDateRange(@Valid @RequestBody DateRangeDTO dateRangeDTO, Principal principal) {
        List<Income> incomes = incomeRepository.findByUserUsernameAndDateBetween(
                principal.getName(), dateRangeDTO.getStartDate(), dateRangeDTO.getEndDate());
        return ResponseEntity.ok(incomes);
    }

    @GetMapping("/total")
    public ResponseEntity<?> getTotalIncome(Principal principal) {
        Double totalIncome = incomeRepository.getTotalIncomeByUser(principal.getName());
        return ResponseEntity.ok(totalIncome != null ? totalIncome : 0.0);
    }

    @GetMapping("/by-category")
    public ResponseEntity<?> getIncomesByCategory(Principal principal) {
        List<Object[]> incomesByCategory = incomeRepository.getTotalIncomeByCategory(principal.getName());
        return ResponseEntity.ok(incomesByCategory);
    }
}