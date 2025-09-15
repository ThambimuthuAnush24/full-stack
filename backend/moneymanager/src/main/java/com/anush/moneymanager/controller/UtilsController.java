package com.anush.moneymanager.controller;

import com.anush.moneymanager.dto.CategoryDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utils")
public class UtilsController {

    @GetMapping("/categories")
    public ResponseEntity<?> getPredefinedCategories() {
        Map<String, List<CategoryDTO>> response = new HashMap<>();

        // Income Categories
        List<CategoryDTO> incomeCategories = new ArrayList<>();

        // Add income categories
        CategoryDTO salary = new CategoryDTO();
        salary.setName("Salary");
        salary.setType("income");
        salary.setEmoji("💰");
        salary.setColor("#28a745");
        incomeCategories.add(salary);

        CategoryDTO freelance = new CategoryDTO();
        freelance.setName("Freelance");
        freelance.setType("income");
        freelance.setEmoji("💻");
        freelance.setColor("#17a2b8");
        incomeCategories.add(freelance);

        CategoryDTO investments = new CategoryDTO();
        investments.setName("Investments");
        investments.setType("income");
        investments.setEmoji("📈");
        investments.setColor("#fd7e14");
        incomeCategories.add(investments);

        CategoryDTO gifts = new CategoryDTO();
        gifts.setName("Gifts");
        gifts.setType("income");
        gifts.setEmoji("🎁");
        gifts.setColor("#e83e8c");
        incomeCategories.add(gifts);

        CategoryDTO refunds = new CategoryDTO();
        refunds.setName("Refunds");
        refunds.setType("income");
        refunds.setEmoji("↩️");
        refunds.setColor("#6f42c1");
        incomeCategories.add(refunds);

        CategoryDTO otherIncome = new CategoryDTO();
        otherIncome.setName("Other");
        otherIncome.setType("income");
        otherIncome.setEmoji("💲");
        otherIncome.setColor("#6c757d");
        incomeCategories.add(otherIncome);

        // Expense Categories
        List<CategoryDTO> expenseCategories = new ArrayList<>();

        // Add expense categories
        CategoryDTO housing = new CategoryDTO();
        housing.setName("Housing");
        housing.setType("expense");
        housing.setEmoji("🏠");
        housing.setColor("#dc3545");
        expenseCategories.add(housing);

        CategoryDTO food = new CategoryDTO();
        food.setName("Food");
        food.setType("expense");
        food.setEmoji("🍔");
        food.setColor("#fd7e14");
        expenseCategories.add(food);

        CategoryDTO transportation = new CategoryDTO();
        transportation.setName("Transportation");
        transportation.setType("expense");
        transportation.setEmoji("🚗");
        transportation.setColor("#6610f2");
        expenseCategories.add(transportation);

        CategoryDTO entertainment = new CategoryDTO();
        entertainment.setName("Entertainment");
        entertainment.setType("expense");
        entertainment.setEmoji("🎬");
        entertainment.setColor("#e83e8c");
        expenseCategories.add(entertainment);

        CategoryDTO shopping = new CategoryDTO();
        shopping.setName("Shopping");
        shopping.setType("expense");
        shopping.setEmoji("🛍️");
        shopping.setColor("#20c997");
        expenseCategories.add(shopping);

        CategoryDTO utilities = new CategoryDTO();
        utilities.setName("Utilities");
        utilities.setType("expense");
        utilities.setEmoji("💡");
        utilities.setColor("#ffc107");
        expenseCategories.add(utilities);

        CategoryDTO healthcare = new CategoryDTO();
        healthcare.setName("Healthcare");
        healthcare.setType("expense");
        healthcare.setEmoji("🏥");
        healthcare.setColor("#17a2b8");
        expenseCategories.add(healthcare);

        CategoryDTO education = new CategoryDTO();
        education.setName("Education");
        education.setType("expense");
        education.setEmoji("📚");
        education.setColor("#007bff");
        expenseCategories.add(education);

        CategoryDTO otherExpense = new CategoryDTO();
        otherExpense.setName("Other");
        otherExpense.setType("expense");
        otherExpense.setEmoji("📋");
        otherExpense.setColor("#6c757d");
        expenseCategories.add(otherExpense);

        // Add to response
        response.put("income", incomeCategories);
        response.put("expense", expenseCategories);

        return ResponseEntity.ok(response);
    }
}
