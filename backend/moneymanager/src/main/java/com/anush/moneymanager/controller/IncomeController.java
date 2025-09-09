package com.anush.moneymanager.controller;

import com.anush.moneymanager.entity.Income;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {
    @PostMapping
    public ResponseEntity<?> addIncome(@RequestBody Income income,
                                       Principal principal) {
        income.setUser(userRepository.findByUsername(principal.getName()));
        incomeRepository.save(income);
        return ResponseEntity.ok("Income added successfully");
    }

    @GetMapping
    public List<Income> getIncomes(Principal principal) {
        return incomeRepository.findByUserUsername(principal.getName());
    }
}
