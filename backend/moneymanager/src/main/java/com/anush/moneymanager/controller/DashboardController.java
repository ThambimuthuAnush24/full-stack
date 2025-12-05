package com.anush.moneymanager.controller;

import com.anush.moneymanager.dto.DashboardDTO;
import com.anush.moneymanager.dto.DateRangeDTO;
import com.anush.moneymanager.entity.Expense;
import com.anush.moneymanager.entity.Income;
import com.anush.moneymanager.repository.ExpenseRepository;
import com.anush.moneymanager.repository.IncomeRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping
    public ResponseEntity<?> getDashboardData(Principal principal) {
        String username = principal.getName();

        // Get total income
        Double totalIncome = incomeRepository.getTotalIncomeByUser(username);
        if (totalIncome == null)
            totalIncome = 0.0;

        // Get total expense
        Double totalExpense = expenseRepository.getTotalExpensesByUser(username);
        if (totalExpense == null)
            totalExpense = 0.0;

        // Calculate balance
        Double balance = totalIncome - totalExpense;

        // Get income by category
        List<Object[]> incomeByCategoryData = incomeRepository.getTotalIncomeByCategory(username);
        List<Map<String, Object>> incomeByCategory = convertCategoryData(incomeByCategoryData);

        // Get expense by category
        List<Object[]> expenseByCategoryData = expenseRepository.getTotalExpensesByCategory(username);
        List<Map<String, Object>> expenseByCategory = convertCategoryData(expenseByCategoryData);

        // Get recent transactions (combining incomes and expenses)
        List<Map<String, Object>> recentTransactions = getRecentTransactions(username);

        // Build response
        DashboardDTO dashboardDTO = new DashboardDTO();
        dashboardDTO.setTotalIncome(totalIncome);
        dashboardDTO.setTotalExpense(totalExpense);
        dashboardDTO.setBalance(balance);
        dashboardDTO.setIncomeByCategory(incomeByCategory);
        dashboardDTO.setExpenseByCategory(expenseByCategory);
        dashboardDTO.setRecentTransactions(recentTransactions);

        return ResponseEntity.ok(dashboardDTO);
    }

    @PostMapping("/date-range")
    public ResponseEntity<?> getDashboardDataByDateRange(
            @Valid @RequestBody DateRangeDTO dateRangeDTO, Principal principal) {
        String username = principal.getName();

        // Get incomes for date range
        List<Income> incomes = incomeRepository.findByUserUsernameAndDateBetween(
                username, dateRangeDTO.getStartDate(), dateRangeDTO.getEndDate());

        // Get expenses for date range
        List<Expense> expenses = expenseRepository.findByUserUsernameAndDateBetween(
                username, dateRangeDTO.getStartDate(), dateRangeDTO.getEndDate());

        // Calculate totals
        Double totalIncome = incomes.stream()
                .mapToDouble(Income::getAmount)
                .sum();

        Double totalExpense = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        Double balance = totalIncome - totalExpense;

        // Group incomes by category
        Map<String, Double> incomeByCategory = incomes.stream()
                .collect(Collectors.groupingBy(
                        Income::getCategory,
                        Collectors.summingDouble(Income::getAmount)));

        // Group expenses by category
        Map<String, Double> expenseByCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)));

        // Convert to response format
        List<Map<String, Object>> incomeByCategoryList = incomeByCategory.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category", entry.getKey());
                    map.put("amount", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> expenseByCategoryList = expenseByCategory.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category", entry.getKey());
                    map.put("amount", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        // Build response
        DashboardDTO dashboardDTO = new DashboardDTO();
        dashboardDTO.setTotalIncome(totalIncome);
        dashboardDTO.setTotalExpense(totalExpense);
        dashboardDTO.setBalance(balance);
        dashboardDTO.setIncomeByCategory(incomeByCategoryList);
        dashboardDTO.setExpenseByCategory(expenseByCategoryList);

        // Get combined transactions for the period
        List<Map<String, Object>> transactions = new ArrayList<>();

        // Add incomes
        for (Income income : incomes) {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("id", income.getId());
            transaction.put("type", "income");
            transaction.put("amount", income.getAmount());
            transaction.put("category", income.getCategory());
            transaction.put("description", income.getDescription());
            transaction.put("date", income.getDate());
            transactions.add(transaction);
        }

        // Add expenses
        for (Expense expense : expenses) {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("id", expense.getId());
            transaction.put("type", "expense");
            transaction.put("amount", expense.getAmount());
            transaction.put("category", expense.getCategory());
            transaction.put("description", expense.getDescription());
            transaction.put("date", expense.getDate());
            transactions.add(transaction);
        }

        // Sort by date (most recent first)
        transactions.sort((t1, t2) -> ((Date) t2.get("date")).compareTo((Date) t1.get("date")));

        dashboardDTO.setRecentTransactions(transactions);

        return ResponseEntity.ok(dashboardDTO);
    }

    private List<Map<String, Object>> convertCategoryData(List<Object[]> categoryData) {
        return categoryData.stream()
                .map(data -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category", data[0]);
                    map.put("amount", data[1]);
                    return map;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getRecentTransactions(String username) {
        // Get recent incomes (last 10)
        List<Income> recentIncomes = incomeRepository.findByUserUsername(username);

        // Get recent expenses (last 10)
        List<Expense> recentExpenses = expenseRepository.findByUserUsername(username);

        // Combine and convert to map
        List<Map<String, Object>> transactions = new ArrayList<>();

        // Add incomes
        for (Income income : recentIncomes) {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("id", income.getId());
            transaction.put("type", "income");
            transaction.put("amount", income.getAmount());
            transaction.put("category", income.getCategory());
            transaction.put("description", income.getDescription());
            transaction.put("date", income.getDate());
            transactions.add(transaction);
        }

        // Add expenses
        for (Expense expense : recentExpenses) {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("id", expense.getId());
            transaction.put("type", "expense");
            transaction.put("amount", expense.getAmount());
            transaction.put("category", expense.getCategory());
            transaction.put("description", expense.getDescription());
            transaction.put("date", expense.getDate());
            transactions.add(transaction);
        }

        // Sort by date (most recent first)
        transactions.sort((t1, t2) -> ((Date) t2.get("date")).compareTo((Date) t1.get("date")));

        // Limit to most recent 10
        if (transactions.size() > 10) {
            transactions = transactions.subList(0, 10);
        }

        return transactions;
    }
}
